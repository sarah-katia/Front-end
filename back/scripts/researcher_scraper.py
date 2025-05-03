from bs4 import BeautifulSoup
import requests
import re
import sys
import csv
import argparse
import time
sys.stdout.reconfigure(encoding='utf-8')
from scholarly import scholarly
from datetime import datetime
import dateutil.parser
import pandas as pd
import numpy as np
import os
import PyPDF2
import difflib
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import warnings
warnings.filterwarnings("ignore")  # At the top of your MAJ.py script
import json
import hashlib
import datetime
from pathlib import Path
import os.path as ospath

# Define script and cache directories - ensure proper paths relative to script location
# Get the directory where the script is located
SCRIPT_DIR = Path(ospath.dirname(ospath.abspath(__file__)))
BASE_DIR = SCRIPT_DIR.parent  # back directory
CACHE_DIR = SCRIPT_DIR / "cache"  # create cache inside scripts directory
CACHE_DIR.mkdir(exist_ok=True)


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Scrape researcher publications')
    parser.add_argument('--name', required=True, help='Researcher name')
    parser.add_argument('--id', required=True, help='Researcher ID')
    parser.add_argument('--output', required=True, help='Output CSV file path')
    parser.add_argument('--confJournaloutput', required=True, help='Output confJournal CSV file path')
    parser.add_argument('--Classmentoutput', required=True, help='Output classment CSV file path')
    args = parser.parse_args()
    
    try:

        fieldnames = [
                'publication_id',
                'Lien Google Scholar',
                'Editors',
                'Book',
                'Publisher',
                'chercheur',
                'chercheur_id',
                'Titre_publication',
                'Auteurs',
                'Lien',
                'Journal',
                'Conference',
                'date_publication',
                'Volumes',
                'nombre_pages',
                'Type'
            ]

        # File paths

        fichier_articles = "google_scholar.csv" #result google scholar
        csv_file = "dblp.csv" #result dblp

        # List of researchers to process
        noms_chercheurs = [{
            'nom_complet': args.name,
            'id': args.id
        }]
        

        print("\n\nnom dsfdf :\n\n",noms_chercheurs)
        #finale outpout publication file
        final_outpout = args.output
        confJournal_output = args.confJournaloutput
        classment_output = args.Classmentoutput


        ######################### dblp #######################################

        def extract_publisher_booktitle(bibtex_string):

            # Function to extract a specific field accounting for nested braces
            def extract_field(field_name):
                # Pattern matches field_name = { with content that may include nested braces
                pattern = rf'{field_name}\s*=\s*\{{((?:[^{{}}]|(?:\{{[^{{}}]*\}}))*)\}}'
                match = re.search(pattern, bibtex_string, re.DOTALL)
                
                if not match:
                    return None
                    
                # Get the raw content with potential nested braces
                raw_content = match.group(1)
                
                # Clean up whitespace (newlines, multiple spaces)
                cleaned_content = re.sub(r'\s+', ' ', raw_content).strip()
                
                # Remove all braces and their contents for special LaTeX commands
                # Pattern like {\'{e}} or {\&} - remove these entirely or replace with simple version
                cleaned_content = re.sub(r'\{\\\'.*?\}', '', cleaned_content)
                cleaned_content = re.sub(r'\{\\&\}', '&', cleaned_content)
                
                # Remove all remaining braces but keep their contents
                cleaned_content = re.sub(r'\{([^{}]*)\}', r'\1', cleaned_content)
                
                return cleaned_content
            
            # Extract the fields
            publisher = extract_field('publisher')
            booktitle = extract_field('booktitle')
            
            return publisher, booktitle


        def get_dblp_researcher_link(researcher_name):
            
            # Format the researcher name for the URL
            formatted_name = researcher_name.lower().replace(' ', '+')
            
            # DBLP search URL - specifically search for author profiles
            search_url = f"https://dblp.org/search/author?q={formatted_name}"
            
            try:
                # Send request to DBLP
                response = requests.get(search_url)
                response.raise_for_status()
                
                # Parse the HTML content
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look specifically for author entries
                # DBLP uses the 'person' itemtype for researcher profiles
                authors = soup.find_all(['div', 'li'], itemtype=re.compile('Person'))
                
                if not authors:
                    # If no direct match in author search, try the general search
                    search_url = f"https://dblp.org/search?q={formatted_name}"
                    response = requests.get(search_url)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Look for person entries in general search
                    authors = soup.find_all(['div', 'li'], itemtype=re.compile('Person'))
                
                # Take the first author match if available
                if authors:
                    for author in authors:
                        # Find the main profile link, which usually contains '/pid/'
                        link = author.find('a', href=re.compile(r'/pid/'))
                        if link and 'href' in link.attrs:
                            return link['href']
                
                # If no match is found
                return None
            
            except Exception as e:
            
                print(f"Error: {str(e)}")  # For debugging, can be removed
                return None


        # Open CSV file
        with open(csv_file, mode='w', newline='', encoding='utf-8') as csv_file:
            # Define CSV headers
            fieldnames = ['chercheur', 'chercheur_id', 'Titre_publication', 'Auteurs', 'nombre_pages', 'Type', 
                        'Lien', 'Volumes', 'Journal', 'date_publication', 'Publisher', 'Conference']
            
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()

            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

            for i, author_info in enumerate(noms_chercheurs):
                author_name = author_info["nom_complet"]
                author_id = author_info["id"]
                
                try:
                    link = get_dblp_researcher_link(author_name)
                    if not link:
                        print(f"Skip: No DBLP link found for author: {author_name}")
                        continue  # Skip to next author

                    response = requests.get(link, headers=headers)
                    if response.status_code == 429:
                        print("Rate limit hit! Sleeping for 10 seconds...")
                        time.sleep(10)
                        continue  # Skip this iteration

                    html_text = response.text

                except Exception as e:
                    print(f"Skip: Error processing author {author_name}: {str(e)}")
                    continue  # Skip to next author

                # Parse HTML
                soup = BeautifulSoup(html_text, 'lxml')
                descriptions = soup.find_all('nav', class_="publ")
                print(f"Author: {author_name}")
                
                for desc in descriptions:
                    enter = desc.find_all('li', class_="drop-down")
                    if not enter or len(enter) < 2:
                        continue

                    links = enter[1].find_all('li')
                    if len(links) < 6:
                        continue

                    link1 = links[0].a
                    link2 = links[5].a

                    # Fetch XML data
                    try:
                        xml_text = requests.get(link2['href'], headers=headers).text
                        info = BeautifulSoup(xml_text, 'lxml')

                        authors = info.find_all('author')
                        ath_list = " and ".join(author.text for author in authors)

                        title = info.find('title').text.strip().rstrip('.') if info.find('title') else "None"
                        pages = info.find('pages').text if info.find('pages') else "None"
                        year = info.find('year').text if info.find('year') else "None"

                        # Determine type
                        type = "unknown"
                        if info.find('crossref'):
                            type = "conference"
                        if info.find('journal'):
                            type = "journal"
                        article = info.find('article')
                        if article and article.get('publtype'):
                            type = "informal"

                        link = info.find('ee').text if info.find('ee') else "None"
                        journal_name = info.find('journal').text.strip().rstrip('.') if info.find('journal') else "None"
                        volume = info.find('volume').text if info.find('volume') else "None"

                        # Fetch additional BibTeX data
                        try:
                            _text = requests.get(link1['href'], headers=headers).text
                            soup3 = BeautifulSoup(_text, 'lxml')
                            infos3 = soup3.find('div', attrs={"id": "bibtex-section"})

                            if infos3 is not None:
                                publisher, booktitle = extract_publisher_booktitle(infos3.text)
                            else:
                                publisher, booktitle = 'none', 'none'
                        except:
                            publisher, booktitle = 'none', 'none'

                        
                        # Delay to prevent rate-limiting
                        time.sleep(2)
                        # Write to CSV
                        writer.writerow({
                            'chercheur': author_name,
                            'chercheur_id': author_id,
                            'Titre_publication': title,
                            'Auteurs': ath_list,
                            'nombre_pages': pages,
                            'Type': type,
                            'Lien': link,
                            'Volumes': volume,
                            'Journal': journal_name,
                            'date_publication': year,
                            'Publisher': publisher,
                            'Conference': booktitle
                        })

                    except Exception as e:
                        print(f"Skip: Error fetching publication data: {str(e)}")
                        continue

        print(f"results saved in{csv_file}")        

        ############################### Google Scholar #########################################

        def extract_year_from_date(date_str):
        
            if not date_str or pd.isna(date_str):  # Handle empty or NaN inputs
                return None

            date_str = str(date_str).strip()  # Convert to string and remove whitespace

            try:
                # Check if the input is in 'YYYY' format
                if re.match(r'^\d{4}$', date_str):
                    return date_str  # Return the year as a string

                # Check if the input is in 'YYYY-MM-DD' format
                elif re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
                    parsed_date = datetime.strptime(date_str, '%Y-%m-%d')
                    return str(parsed_date.year)  # Extract the year and convert to string

                # Handle other formats (e.g., '18-Jun')
                else:
                    # Try parsing with dateutil's parser as a fallback
                    parsed_date = dateutil.parser.parse(date_str)
                    return str(parsed_date.year)  # Extract the year and convert to string

            except (ValueError, TypeError):
                # If parsing fails, return None
                return None

        def nettoyer_texte(texte):
            """
            Cleans special characters from the text.

            Args:
                texte (str): The text to clean.

            Returns:
                str: The cleaned text.
            """
            if texte is None:
                return ""
            # Replace special characters with ASCII equivalents
            texte = texte.replace('\u2010', '-')  # Hyphen
            texte = texte.replace('\u2013', '-')  # En dash
            texte = texte.replace('\u2014', '--')  # Em dash
            texte = texte.replace('\u2018', "'")  # Left single quotation mark
            texte = texte.replace('\u2019', "'")  # Right single quotation mark
            texte = texte.replace('\u201C', '"')  # Left double quotation mark
            texte = texte.replace('\u201D', '"')  # Right double quotation mark
            return texte

        # Base URL for Google Scholar
        scholar_base_url = "https://scholar.google.com"

        # Open a CSV file to store the results
        with open(fichier_articles, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            # Write the CSV header
            writer.writerow([
                "chercheur", "chercheur_id", "Titre_publication", "Auteurs", "Lien Google Scholar", 
                "Lien", "Journal", "Conference",
                "date_publication", "Volumes", "nombre_pages", "Editors", "Book", "Type"
            ])
            for chercheur in noms_chercheurs:
                nom_chercheur = chercheur["nom_complet"]  # Researcher name
                id_chercheur = chercheur["id"]  # Researcher ID

                # Print the researcher's name
                try:
                    print(f"Recherche des articles de {nom_chercheur}...".encode('utf-8', errors='replace').decode('utf-8'))
                except UnicodeEncodeError:
                    print(f"Recherche des articles de [Nom non affichable]...")

                try:
                    # Search for the researcher
                    chercheur_scholarly = next(scholarly.search_author(nom_chercheur))
                    # Fill in the researcher's details
                    chercheur_scholarly = scholarly.fill(chercheur_scholarly, sections=["publications"])
                except StopIteration:
                    print(f" Aucun résultat trouvé pour {nom_chercheur}\n")
                    continue

                articles_traitees = set()  # Set to track processed articles
                compteur_articles = 0  # Counter for articles

                for pub in chercheur_scholarly["publications"]:
                    pub_id = pub.get("author_pub_id")
                    if pub_id in articles_traitees:
                        continue  # Skip already processed articles

                    # Fetch publication details
                    pub_details = scholarly.fill(pub)
                    title = nettoyer_texte(pub_details['bib'].get('title', 'N/A'))
                    authors = nettoyer_texte(pub_details['bib'].get('author', 'N/A'))
                    #citations = pub_details.get('num_citations', 0)  # Number of citations

                    if pub_id:
                        author_id = chercheur_scholarly["scholar_id"]
                        article_url = f"{scholar_base_url}/citations?view_op=view_citation&hl=en&user={author_id}&citation_for_view={pub_id}"

                        compteur_articles += 1

                        articles_traitees.add(pub_id)
                        time.sleep(2)  # Respectful delay

                        # Scrape the article page for additional details
                        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
                        article_response = requests.get(article_url, headers=headers)

                        if article_response.status_code == 200:
                            article_soup = BeautifulSoup(article_response.text, "html.parser")

                            # Initialize default values
                            journal = "N/A"
                            conference = "N/A"
                            lien_direct = "N/A"
                            date_publication = "N/A"
                            volume = "N/A"
                            pages = "N/A"
                            editeur = "N/A"
                            book = "N/A"
                            Type = "N/A"  

                            # Extract the direct link (if available)
                            lien_direct_tag = article_soup.find("a", string=["View article", "Full text", "PDF"])
                            if lien_direct_tag and "href" in lien_direct_tag.attrs:
                                lien_direct = lien_direct_tag["href"]

                            # Extract additional fields
                            for field in article_soup.find_all("div", class_="gs_scl"):
                                field_name = field.find("div", class_="gsc_oci_field").text.strip()
                                field_value = nettoyer_texte(field.find("div", class_="gsc_oci_value").text.strip())

                                # Map fields to variables
                                if field_name == "Journal":
                                    journal = field_value
                                    Type = "journal"
                                elif field_name == "Conference":
                                    conference = field_value
                                    Type = "conference"
                                elif field_name == "Publication date":
                                    date_publication = extract_year_from_date(field_value)
                                elif field_name == "Volume":
                                    volume = field_value
                                elif field_name == "Pages":
                                    pages = field_value
                                elif field_name == "Publisher":
                                    editeur = field_value
                                elif field_name == "Book":
                                    book = field_value

                            # Write the data to the CSV file
                            writer.writerow([
                                nom_chercheur,  # Author name
                                id_chercheur,  # Author ID
                                title,  # Article title
                                authors,  # Authors
                                article_url,  # Google Scholar link
                                lien_direct,  # Direct link
                                journal,  # Journal
                                conference,  # Conference
                                date_publication,  # Publication date
                                volume,  # Volume
                                pages,  # Pages
                                editeur,  # Editors
                                book,  # Book
                                Type,  # Type (journal/conference)
                            ])
                        else:
                            print(f" Erreur {article_response.status_code} lors du scraping de l'article.")

                    time.sleep(2)  # Respectful delay

                # Print the number of articles processed
                try:
                    print(f" {compteur_articles} articles enregistrés pour {nom_chercheur}\n".encode('utf-8', errors='replace').decode('utf-8'))
                except UnicodeEncodeError:
                    print(f" {compteur_articles} articles enregistrés pour [Nom non affichable]\n")
                time.sleep(3)  # Respectful delay

        # Print completion message
        try:
            print(f"🎉 Extraction terminée. Résultats stockés dans '{fichier_articles}'".encode('utf-8', errors='replace').decode('utf-8'))
        except UnicodeEncodeError:
            print("🎉 Extraction terminée. Résultats stockés dans le fichier CSV.")

        ##################################### MERGING ##################################

        def normalize_string(s):
            
            if pd.isna(s) or not isinstance(s, str):
                return s
            
            # Convert to lowercase
            s = s.lower()
            
            # Replace multiple spaces with a single space
            s = re.sub(r'\s+', ' ', s)
            
            # Remove punctuation that might affect matching (keeping spaces)
            s = re.sub(r'[.,;:!?"\'\(\)\[\]{}]', '', s)
            
            # Trim leading/trailing whitespace
            s = s.strip()
            
            return s

        def merge_csv_files(file1_path, file2_path, output_path, merge_keys, prioritize_fields=None, normalize_keys=True):
            
            # Read the CSV files
            try:
                df1 = pd.read_csv(file1_path, dtype=str)
                df1 = df1.fillna('')  # Replace NaN with empty string for consistent handling
                print(f"File 1: {file1_path} - {len(df1)} rows")
            except pd.errors.EmptyDataError:
                print(f"Warning: File {file1_path} is empty or has no parsable data")
                df1 = pd.DataFrame()
            
            try:
                df2 = pd.read_csv(file2_path, dtype=str)
                df2 = df2.fillna('')  # Replace NaN with empty string for consistent handling
                print(f"File 2: {file2_path} - {len(df2)} rows")
            except pd.errors.EmptyDataError:
                print(f"Warning: File {file2_path} is empty or has no parsable data")
                df2 = pd.DataFrame()
            
           # Define your complete header structure
            COMPLETE_HEADER = [
                'Lien Google Scholar',
                'Editors',
                'Book',
                'Publisher',
                'chercheur',
                'chercheur_id',
                'Titre_publication',
                'Auteurs',
                'Lien',
                'Journal',
                'Conference',
                'date_publication',
                'Volumes',
                'nombre_pages',
                'Type'
            ]

            # Modify this part of your code where you handle empty dataframes
            if df1.empty and df2.empty:
                print("Both files are empty. Created an output file with complete header structure.")
                empty_df = pd.DataFrame(columns=COMPLETE_HEADER)
                empty_df.to_csv(output_path, index=False)
                return empty_df
                
            elif df1.empty:
                print("File 1 is empty. Using data from File 2 with complete header structure.")
                # Create new dataframe with complete header structure
                output_df = pd.DataFrame(columns=COMPLETE_HEADER)
                
                # Copy matching columns from df2
                for col in COMPLETE_HEADER:
                    if col in df2.columns:
                        output_df[col] = df2[col]
                    else:
                        output_df[col] = None  # Fill missing columns with None
                
                # Remove any normalized columns that might have been copied
                normalized_cols = [col for col in output_df.columns if col.startswith('_normalized_')]
                if normalized_cols:
                    output_df = output_df.drop(normalized_cols, axis=1)
                
                output_df.to_csv(output_path, index=False)
                return output_df
                
            elif df2.empty:
                print("File 2 is empty. Using data from File 1 with complete header structure.")
                # Create new dataframe with complete header structure
                output_df = pd.DataFrame(columns=COMPLETE_HEADER)
                
                # Copy matching columns from df1
                for col in COMPLETE_HEADER:
                    if col in df1.columns:
                        output_df[col] = df1[col]
                    else:
                        output_df[col] = None  # Fill missing columns with None
                
                # Remove any normalized columns that might have been copied
                normalized_cols = [col for col in output_df.columns if col.startswith('_normalized_')]
                if normalized_cols:
                    output_df = output_df.drop(normalized_cols, axis=1)
                
                output_df.to_csv(output_path, index=False)
                return output_df
                        
            # Create normalized columns for merging while preserving original data
            if normalize_keys:
                # Create normalized versions of the merge keys for comparison
                for df in [df1, df2]:
                    if not df.empty:
                        for key in merge_keys:
                            if key in df.columns:
                                normalized_key = f"_normalized_{key}"
                                df[normalized_key] = df[key].apply(normalize_string)
                
                # Use normalized keys for merging
                normalized_merge_keys = [f"_normalized_{key}" for key in merge_keys]
            else:
                normalized_merge_keys = merge_keys
            
            # Check for duplicates in merge keys using normalized values
            if not df1.empty:
                df1_dupe_count = df1.duplicated(subset=normalized_merge_keys, keep=False).sum()
                if df1_dupe_count > 0:
                    print(f"Warning: File 1 has {df1_dupe_count} duplicate entries based on merge keys {merge_keys}")
                    # Group by normalized merge keys and combine rows
                    df1 = df1.sort_values(by=normalized_merge_keys)
                    df1 = df1.groupby(normalized_merge_keys, as_index=False).first()
            else:
                df1_dupe_count = 0
            
            if not df2.empty:
                df2_dupe_count = df2.duplicated(subset=normalized_merge_keys, keep=False).sum()
                if df2_dupe_count > 0:
                    print(f"Warning: File 2 has {df2_dupe_count} duplicate entries based on merge keys {merge_keys}")
                    # Group by normalized merge keys and combine rows
                    df2 = df2.sort_values(by=normalized_merge_keys)
                    df2 = df2.groupby(normalized_merge_keys, as_index=False).first()
            else:
                df2_dupe_count = 0
            
            # Initialize prioritize_fields if not provided
            if prioritize_fields is None:
                prioritize_fields = {}
            
            # Create a suffix for the merged columns
            suffix = ('_file1', '_file2')


            print(df1)
            print(df2)
            
            
            # Ensure all normalized merge keys exist in both dataframes
            for key in normalized_merge_keys:
                if key not in df1.columns:
                    df1[key] = pd.Series(dtype='str')
                if key not in df2.columns:
                    df2[key] = pd.Series(dtype='str')


            merged_df = pd.merge(df1, df2, on=normalized_merge_keys, how='outer', suffixes=suffix, indicator=True)

            print(merged_df)
            # Store merge info for statistics but don't keep in final output
            merge_info = merged_df['_merge'].copy()

            print(merged_df)
            
            # List all columns that were duplicated during the merge (excluding normalized keys)
            all_columns = list(df1.columns) + list(df2.columns)
            duplicate_columns = [col for col in all_columns 
                                if col not in normalized_merge_keys 
                                and not col.startswith('_normalized_')
                                and col in df1.columns and col in df2.columns]
            
            # Handle each duplicate column based on prioritization rules
            for col in duplicate_columns:
                col1 = f"{col}{suffix[0]}"
                col2 = f"{col}{suffix[1]}"
                
                # Check if column exists in the merged dataframe
                if col1 in merged_df.columns and col2 in merged_df.columns:
                    # Determine prioritization for this column
                    priority = prioritize_fields.get(col, 'non_none')
                    
                    if priority == 'file1':
                        # Always use file1 values when available
                        merged_df[col] = merged_df[col1].combine_first(merged_df[col2])
                    elif priority == 'file2':
                        # Always use file2 values when available
                        merged_df[col] = merged_df[col2].combine_first(merged_df[col1])
                    else:  # 'non_none' is the default
                        # Use non-empty values, preferring file1 in case both are non-empty
                        merged_df[col] = merged_df.apply(
                            lambda row: row[col1] if row[col1] and row[col1] != 'None' 
                                        else row[col2] if row[col2] and row[col2] != 'None' 
                                        else row[col1],
                            axis=1
                        )
                    
                    # Drop the duplicate columns
                    merged_df = merged_df.drop([col1, col2], axis=1)
            
            print(merged_df) 
            # Remove the _merge column
            merged_df = merged_df.drop('_merge', axis=1)
            
            # Print merge statistics using the stored merge info
            both_count = (merge_info == 'both').sum()
            left_only_count = (merge_info == 'left_only').sum()
            right_only_count = (merge_info == 'right_only').sum()
            
            print(f"Merged results:")
            print(f"  - Records in both files: {both_count}")
            print(f"  - Records only in file 1: {left_only_count}")
            print(f"  - Records only in file 2: {right_only_count}")
            print(f"  - Total initial records: {len(merged_df)}")
            print(merged_df) 
            # Remove the normalized columns 
            if normalize_keys:
                # Drop temporary normalized columns
                for key in merge_keys:
                    normalized_key = f"_normalized_{key}"
                    if normalized_key in merged_df.columns:
                        merged_df = merged_df.drop(normalized_key, axis=1)

            print(merged_df)            
            
            # Ensure original merge keys are retained in the output
            for key in merge_keys:
                if key not in merged_df.columns and f"{key}{suffix[0]}" in merged_df.columns:
                    merged_df[key] = merged_df[f"{key}{suffix[0]}"]
                    merged_df = merged_df.drop(f"{key}{suffix[0]}", axis=1)
                elif key not in merged_df.columns and f"{key}{suffix[1]}" in merged_df.columns:
                    merged_df[key] = merged_df[f"{key}{suffix[1]}"]
                    merged_df = merged_df.drop(f"{key}{suffix[1]}", axis=1)
            
            # Now perform the cleaning AFTER the merge is complete
            print("\nCleaning the merged data:")
            initial_row_count = len(merged_df)
            
            # 1. Remove rows with missing merge keys
            for key in merge_keys:
                if key in merged_df.columns:
                    merged_df = merged_df[merged_df[key].notna() & (merged_df[key] != '')]
                    if initial_row_count != len(merged_df):
                        print(key)
            
            # Report rows removed due to missing keys
            rows_removed = initial_row_count - len(merged_df)
            if rows_removed > 0:
                print(f"  - Removed {rows_removed} rows with missing merge key values")
            
            # 2. Remove empty columns (all values are empty strings or NaN)
            initial_column_count = len(merged_df.columns)
            
            # Find completely empty columns
            empty_columns = []
            for col in merged_df.columns:
                # Check if column is entirely empty (NaN or empty string)
                if merged_df[col].isna().all() or (merged_df[col] == '').all():
                    empty_columns.append(col)
            
            
            # 3. Check for duplicates after cleaning
            final_dupe_count = merged_df.duplicated(subset=merge_keys, keep=False).sum()
            if final_dupe_count > 0:
                print(f"  - Warning: Final output has {final_dupe_count} duplicate entries based on merge keys {merge_keys}")
                print("  - De-duplicating final output...")
                merged_df = merged_df.sort_values(by=merge_keys)
                merged_df = merged_df.groupby(merge_keys, as_index=False).first()
                print(f"  - After de-duplication: {len(merged_df)} records")
            
            print(f"Final cleaned result: {len(merged_df)} rows, {len(merged_df.columns)} columns")
            
            # Save to output file
            merged_df.to_csv(output_path, index=False)
            print(f"Merged file saved to: {output_path}")
            
            return merged_df


        # Merging
        if __name__ == "__main__":
            merge_csv_files(
                'google_scholar.csv', #file1
                'dblp.csv', #file2
                'merged_publications.csv', #result file
                merge_keys=['chercheur_id', 'date_publication', 'Titre_publication'],  
                prioritize_fields={
                    
                    'pages': 'file2'
                },
                normalize_keys=True  # Enable string normalization
            )

        ########################################## Generate ID ######################################

        def generate_publication_id(publication_name, year):
            # Remove special characters and spaces, and convert to lowercase
            cleaned_name = re.sub(r'[^a-zA-Z0-9]', '', publication_name).lower()

            
            middle_index = len(cleaned_name) // 2
            shortened_name = (
                    cleaned_name[0:2] +                      # first 2 characters
                    cleaned_name[middle_index] +             # middle character
                    cleaned_name[-2:]                        # last 2 characters
                )

            # Combine with year
            publication_id = f"{shortened_name}{year}"

            return publication_id

        def process_publications_id(input_file, output_file, name_column, year_column):
            with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
                open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
                
                reader = csv.DictReader(infile)
                
                # Add 'ID' as the first column in the output file
                fieldnames = ['publication_id'] + reader.fieldnames
                writer = csv.DictWriter(outfile, fieldnames=fieldnames)
                
                writer.writeheader()  # Write the header row
                
                for row in reader:
                    # Extract the publication name and year from the specified columns
                    publication_name = row[name_column]
                    year = row[year_column]
                    
                    # Generate the ID
                    publication_id = generate_publication_id(publication_name, year)
                    
                    # Create a new row with the ID as the first column
                    new_row = {'publication_id': publication_id}
                    new_row.update(row)  # Add all other columns from the original row
                    
                    # Write the updated row to the new file
                    writer.writerow(new_row)
            os.remove(input_file)  

        input_file = 'merged_publications.csv'  # Replace with your input file name
        output_file = final_outpout  # Replace with your desired output file name
        name_column = 'Titre_publication'  # Replace with the actual column name for publication names
        year_column = 'date_publication'  # Replace with the actual column name for the year
        process_publications_id(input_file, output_file, name_column, year_column)


        ##################################### Table conf/journal #################################

        # Charger le fichier CSV
        input_file = final_outpout  # Fichier avec colonnes Journal et Conference séparées
        output_file = confJournal_output
        existing_output_file = "Table_Conf_Journal.csv"  # Fichier de sortie existant (peut être vide)

                # Charger les données d'entrée
        try:
            if os.path.exists(input_file) and os.path.getsize(input_file) > 0:
                df = pd.read_csv(input_file)
                print(f"Fichier d'entrée chargé avec {len(df)} lignes")
            else:
                print("Le fichier d'entrée est vide ou n'existe pas. Création d'un fichier de sortie vide.")
                df = pd.DataFrame(columns=["publication_id", "Journal", "Conference", "Type"])
        except Exception as e:
            print(f"Erreur lors du chargement du fichier d'entrée: {e}")
            df = pd.DataFrame(columns=["publication_id", "Journal", "Conference", "Type"])

        # Charger les données déjà traitées (si le fichier existe)
        try:
            existing_df = pd.read_csv(existing_output_file)
            processed_names = set(existing_df['ID (Acronyme)'].str.strip().dropna().unique())
            print(f"{len(processed_names)} noms déjà traités chargés depuis le fichier de sortie")
        except FileNotFoundError:
            existing_df = pd.DataFrame()
            processed_names = set()
            print("Aucun fichier de sortie existant trouvé, démarrage d'un nouveau traitement")

        # Afficher les noms des colonnes pour vérification
        print("Colonnes dans le fichier CSV :", df.columns.tolist())

        # En-têtes pour imiter un navigateur réel
        HEADERS = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        }

        # Définir la fonction pour récupérer les détails de Scimago
        def fetch_scimago_details(name, publication_type, pub_id):
            """Récupérer les détails du journal/conférence sur Scimago."""
            base_url = "https://www.scimagojr.com/journalsearch.php"
            tip = "jou" if publication_type.lower() == "journal" else "con"
            params = {"q": name, "tip": tip}
            empty_details = {
                "pub_id": pub_id,
                "Nom": name,
                "Type": publication_type.capitalize(),
                "Thématique": "Not found",
                "Lieu": "Not found",
                "Période": "Not found",
                "Périodicité": "Not found",
                "Scope": "Not found",
            }
            
            try:
                response = requests.get(base_url, params=params, headers=HEADERS, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, "html.parser")
                search_results = soup.find_all("a", href=True)
                
                for link in search_results:
                    if "journalsearch.php?q=" in link["href"]:
                        journal_url = "https://www.scimagojr.com/" + link["href"]
                        return parse_scimago_page(journal_url, publication_type, pub_id, name)
                
                print(f"Aucune correspondance directe trouvée pour {name} ({publication_type})")
                return empty_details  
            except Exception as e:
                print(f"Erreur Scimago pour {name} ({publication_type}) : {e}")
                return empty_details

        # Définir la fonction pour extraire les détails de la page Scimago
        def parse_scimago_page(url, publication_type, pub_id, name):
            """Extraire les détails du journal/conférence de la page Scimago."""
            try:
                response = requests.get(url, headers=HEADERS, timeout=10)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")
                
                details = {
                    "pub_id": pub_id,
                    "Nom": name,
                    "Type": publication_type.capitalize(),
                    "Thématique": "Not found",
                    "Lieu": "Not found",
                    "Période": "Not found",
                    "Périodicité": "Not found",
                    "Scope": "Not found",
                }
                
                # Extraire le nom du journal/conférence
                name_tag = soup.find("div", class_="journaldescription")
                if name_tag and name_tag.find("h1"):
                    details["Nom"] = name_tag.find("h1").text.strip()
                
                # Extraire la thématique (Thématique)
                thematic_area_tag = soup.find("a", href=lambda x: x and "journalrank.php?category=" in x)
                if thematic_area_tag:
                    details["Thématique"] = thematic_area_tag.text.strip()
                
                # Extraire le lieu (Lieu) à partir du lien spécifique
                country_tag = soup.find("a", href=lambda x: x and "journalrank.php?country=" in x)
                if country_tag:
                    details["Lieu"] = country_tag.text.strip()
                
                # Extraire la période (Période) à partir du <div> contenant "Coverage"
                coverage_div = soup.find("h2", text="Coverage")
                if coverage_div:
                    period_p = coverage_div.find_next("p")
                    if period_p and "-" in period_p.text:  # Vérifier si le texte contient une plage de dates
                        details["Période"] = period_p.text.strip()
                
                # Extraire le scope (Scope)
                scope_div = soup.find("div", class_="fullwidth")
                if scope_div:
                    scope_header = scope_div.find("h2", text="Scope")
                    if scope_header:
                        # Extraire tout le texte après le <h2> "Scope"
                        scope_text = ""
                        next_sibling = scope_header.next_sibling
                        while next_sibling:
                            if next_sibling.name == "a":  # S'arrêter au <a> tag
                                break
                            if hasattr(next_sibling, 'text'):
                                scope_text += next_sibling.text.strip() + " "
                            elif isinstance(next_sibling, str):
                                scope_text += next_sibling.strip() + " "
                            next_sibling = next_sibling.next_sibling
                        details["Scope"] = scope_text.strip() or "Not found"
                
                return details
            except Exception as e:
                print(f"Erreur lors de l'analyse de la page Scimago : {e}")
                return {
                    "pub_id": pub_id,
                    "Nom": name,
                    "Type": publication_type.capitalize(),
                    "Thématique": "Not found",
                    "Lieu": "Not found",
                    "Période": "Not found",
                    "Périodicité": "Not found",
                    "Scope": "Not found",
                }

        # Préparer les données à traiter
        data = []
        if not existing_df.empty:
            data = existing_df.to_dict('records')

        # Traiter chaque ligne du fichier original
        for index, row in df.iterrows():
            pub_id = str(row.get("publication_id", f"unknown_{index}")).strip()
            
            # Vérifier si les colonnes Journal ou Conference existent
            has_journal = "Journal" in df.columns and pd.notna(row.get("Journal")) and str(row.get("Journal", "")).strip()
            has_conference = "Conference" in df.columns and pd.notna(row.get("Conference")) and str(row.get("Conference", "")).strip()
            
            # Déterminer si c'est un journal ou une conférence
            if has_journal:
                name = str(row["Journal"]).strip()
                pub_type = row.get("Type", "Journal")
            elif has_conference:
                name = str(row["Conference"]).strip()
                pub_type = row.get("Type", "Conference")
            else:
                # Cas où les colonnes sont manquantes ou vides
                print(f"Ligne {index}: Journal/Conference manquant - Enregistrement avec valeurs Not exist")
                name = "Not exist"
                pub_type = row.get("Type", "Unknown")
            
            if pub_id in processed_names:
                print(f"Publication déjà traitée : {pub_id} - Ignorée")
                continue
            
            print(f"Traitement : {name} ({pub_type}) - ID: {pub_id}")
            
            # Si le nom est "Not exist", créer directement une entrée avec valeurs par défaut
            if name == "Not exist":
                details = {
                    "pub_id": pub_id,
                    "Nom": "Not exist",
                    "Type": pub_type,
                    "Thématique": "Not exist",
                    "Lieu": "Not exist",
                    "Période": "Not exist",
                    "Périodicité": "Not exist",
                    "Scope": "Not exist",
                }
            else:
                # Sinon, récupérer les détails normalement
                details = fetch_scimago_details(name, pub_type, pub_id)
            
            data.append(details)
            processed_names.add(pub_id)  # Ajouter à l'ensemble des noms traités
            time.sleep(2)  # Augmenter le délai pour éviter la limitation de taux

        # Sauvegarder les résultats dans un nouveau fichier CSV
        output_df = pd.DataFrame(data)

        # S'assurer que toutes les colonnes requises existent
        required_columns = [
            "pub_id",
            "Nom",
            "Type",
            "Thématique",
            "Lieu",
            "Période",
            "Périodicité",
            "Scope",
        ]

        for col in required_columns:
            if col not in output_df.columns:
                output_df[col] = "Not found"

        # Réorganiser les colonnes pour une meilleure organisation
        output_df = output_df[required_columns]

        # Remplir les valeurs manquantes par "Not found" pour une meilleure lisibilité
        output_df.fillna("Not found", inplace=True)

        # Sauvegarder le CSV organisé
        output_df.to_csv(output_file, index=False, encoding="utf-8-sig")

        print(f"Détails sauvegardés dans {output_file}")
        print(f"Total de {len(data)} entrées dans le fichier de sortie")

        ################################# Table Pub_Classement ###################################

        # Define cache files with absolute paths
        PDF_CACHE_FILE = CACHE_DIR / "pdf_data_cache.json"
        QUALIS_CACHE_FILE = CACHE_DIR / "qualis_data_cache.csv"
        SCIMAGO_CACHE_FILE = CACHE_DIR / "scimago_data_cache.csv"
        
        # Make sure all paths are absolute using the script directory as the base
        # If these are already absolute paths, they won't be changed
        if not ospath.isabs(final_outpout):
            final_outpout = str(SCRIPT_DIR / final_outpout)
        if not ospath.isabs(classment_output):
            classment_output = str(SCRIPT_DIR / classment_output)
        
        # Function to check if cache is fresh (less than 30 days old)
        def is_cache_fresh(cache_file, max_age_days=30):
            if not cache_file.exists():
                return False
                
            file_time = datetime.datetime.fromtimestamp(cache_file.stat().st_mtime)
            current_time = datetime.datetime.now()
            age = current_time - file_time
            
            return age.days < max_age_days
        
        # Create path-aware helper function for all file operations
        def get_absolute_path(file_path):
            """Convert a path to absolute if it's not already"""
            if ospath.isabs(file_path):
                return file_path
            return str(SCRIPT_DIR / file_path)
        
        # PDF extraction with caching
        def extract_pdf_data_with_cache(url_a, url_b, pdf_a_path, pdf_b_path):
            # Ensure PDF paths are absolute
            pdf_a_path = get_absolute_path(pdf_a_path)
            pdf_b_path = get_absolute_path(pdf_b_path)
            
            # Check if we have a valid cache
            if PDF_CACHE_FILE.exists() and is_cache_fresh(PDF_CACHE_FILE):
                print(f"📂 Using cached PDF data from {PDF_CACHE_FILE}")
                try:
                    with open(PDF_CACHE_FILE, 'r', encoding='utf-8') as f:
                        return json.load(f)
                except Exception as e:
                    print(f"❌ Error reading PDF cache: {e}")
                    # Continue to regenerate the cache
            
            print("📥 Extracting text from PDF files...")
            
            # Download PDFs if needed
            a_success = download_pdf(url_a, pdf_a_path)
            b_success = download_pdf(url_b, pdf_b_path)
            
            # Extract text
            text_a = extract_text_from_pdf(pdf_a_path) if a_success else ""
            text_b = extract_text_from_pdf(pdf_b_path) if b_success else ""
            
            # Create cache
            cache_data = {
                "text_a": text_a,
                "text_b": text_b,
                "created_at": datetime.datetime.now().isoformat(),
                "source_a": url_a,
                "source_b": url_b
            }
            
            # Save cache
            try:
                with open(PDF_CACHE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(cache_data, f, ensure_ascii=False, indent=2)
                print(f"✅ PDF data cached to {PDF_CACHE_FILE}")
            except Exception as e:
                print(f"❌ Error writing PDF cache: {e}")
            
            return cache_data
        
        # Qualis data extraction with caching
        def extract_qualis_data_with_cache(output_file=QUALIS_CACHE_FILE):
            # Check if we have a fresh cache
            cache_path = Path(output_file)
            if cache_path.exists() and is_cache_fresh(cache_path):
                print(f"📂 Using cached Qualis data from {output_file}")
                try:
                    df = pd.read_csv(output_file)
                    if not df.empty and all(col in df.columns for col in ['Name', 'Acronym', 'Rank']):
                        return True
                except Exception as e:
                    print(f"❌ Error reading Qualis cache: {e}")
                    # Continue to regenerate the cache
            
            print("📥 Extracting Qualis conference data...")
            return extract_qualis_data(str(output_file))
        
        # Function to search in cached PDF data
        def search_in_cached_pdfs(journal_name, pdf_cache):
            if not journal_name:
                return ""
                
            text_a = pdf_cache.get("text_a", "")
            text_b = pdf_cache.get("text_b", "")
            
            try:
                # Exact search
                if journal_name in text_a:
                    return "A"
                elif journal_name in text_b:
                    return "B"
                
                # Fuzzy search
                match_a = fuzzy_search(journal_name, text_a)
                match_b = fuzzy_search(journal_name, text_b)
                
                if match_a:
                    return "A"
                elif match_b:
                    return "B"
                
                return ""
            except Exception as e:
                print(f"Error searching PDFs for {journal_name}: {e}")
                return ""
        
        # Scimago data with caching
        def download_scimago_with_cache():
            cache_path = Path(SCIMAGO_CACHE_FILE)
            
            # Check if we have a fresh cache
            if cache_path.exists() and is_cache_fresh(cache_path):
                print(f"📂 Using cached Scimago data from {SCIMAGO_CACHE_FILE}")
                return True
            
            # Download and cache
            if download_scimago():
                try:
                    scimago_df = load_scimago_data()
                    if not scimago_df.empty:
                        scimago_df.to_csv(SCIMAGO_CACHE_FILE, index=False)
                        print(f"✅ Scimago data cached to {SCIMAGO_CACHE_FILE}")
                        return True
                except Exception as e:
                    print(f"❌ Error caching Scimago data: {e}")
            
            return False
        
        # Load Scimago from cache
        def load_scimago_data_with_cache():
            cache_path = Path(SCIMAGO_CACHE_FILE)
            
            if cache_path.exists():
                try:
                    scimago_df = pd.read_csv(SCIMAGO_CACHE_FILE)
                    print(f"📂 Loaded Scimago data from cache")
                    return scimago_df
                except Exception as e:
                    print(f"❌ Error loading Scimago cache: {e}")
            
            # Fallback to original method
            return load_scimago_data()
        
        # Extract combined substrings implementation
        def extract_combined_substrings(
            text, 
            search_term="international", 
            delimiters=[',', '.', ';', '(', ')'], 
            split_delimiters=[' ', '-', "'", ","]
        ):
            # If text is None or empty, return a list with a placeholder
            if not text or pd.isna(text):
                return ["not_exist"]
                
            substrings = []

            try:
                # Convert text and search term to lowercase for case-insensitive matching
                lower_text = text.lower()
                lower_search_term = search_term.lower()

                # Regex pattern to match occurrences of the search term and extract meaningful substrings
                pattern = rf'\b{re.escape(lower_search_term)}[\w\s\-]*'  # Extracts "International XYZ..."
                
                for match in re.finditer(pattern, lower_text):
                    substring = text[match.start(): match.end()].strip()
                    
                    # Ignore unwanted phrases
                    if substring not in ["International Conference", "International Symposium", "International Workshops", "IEEE", "Conference", "International", "conference"]:
                        substrings.append(substring)

                # Extract substrings within parentheses
                for match in re.finditer(r'\(([^)]+)\)', text):  # Finds text inside ( )
                    content = match.group(1).strip()

                    # Ignore purely numeric values
                    if content.isdigit():
                        continue

                    # Split based on common delimiters and pick the first meaningful word
                    for d in split_delimiters:
                        content = content.replace(d, " ")  # Normalize delimiters to spaces

                    words = [w.strip() for w in content.split() if w.strip()]
                    if words and words[0] not in ["International Conference", "International Workshop"]:
                        substrings.append(words[0])  # Take the first meaningful word
            except Exception as e:
                print(f"Error in extract_combined_substrings: {e}")
                return ["not_exist"]

            # Return cleaned text if no valid substrings are found
            return substrings if substrings else [re.sub(r'[()]', '', text).strip()]

        def extract_publications_structured(file_path):
            # Ensure path is absolute
            file_path = get_absolute_path(file_path)
            pubs = []
            
            # Check if file exists
            if not ospath.exists(file_path):
                print(f"Warning: File {file_path} does not exist.")
                return pubs
                
            try:
                with open(file_path, mode="r", encoding="utf-8") as file:
                    reader = csv.DictReader(file)  # Use DictReader to access columns by name
                    
                    for row in reader:
                        pub_id = row.get("publication_id", "").strip()
                        conference = row.get("Conference", "").strip()
                        
                        # Always add the publication ID with conference info (even if empty)
                        pubs.append((pub_id, conference))
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")
                # Return empty list rather than failing completely
            
            # If the list is empty, return at least a placeholder entry
            if not pubs:
                pubs.append(("unknown_id", "not_exist"))
                
            return pubs
        
        def save_ranking_result(result, output_file):
            """Helper function to save ranking results to a CSV file"""
            # Ensure path is absolute
            output_file = get_absolute_path(output_file)
            
            try:
                file_exists = ospath.isfile(output_file)
                # Create directory if it doesn't exist
                os.makedirs(ospath.dirname(output_file), exist_ok=True)
                
                results_df = pd.DataFrame([result])
                results_df.to_csv(output_file, mode='a', header=not file_exists, index=False)
            except Exception as e:
                print(f"Error saving ranking result: {e}")
                # Attempt to write to a backup file if primary fails
                try:
                    backup_file = output_file + ".backup"
                    results_df = pd.DataFrame([result])
                    results_df.to_csv(backup_file, mode='a', index=False)
                except:
                    pass

        def get_core_conference_ranking(conference_names, pub_id, output_file=classment_output):
            """
            Recherche le classement d'une conférence à partir d'une liste de noms et enregistre le premier résultat trouvé.
            Si aucun n'est trouvé, enregistre "Not Found".
            """
            if not pub_id or pub_id == "unknown_id":
                # Still write a record with "Not Found" status
                result = {
                    "pub_id": pub_id if pub_id else "unknown_id",
                    "class_id": 1,
                    "Rank": "Not Found",
                    "URL": ""
                }
                save_ranking_result(result, output_file)
                return False

            if not conference_names or conference_names[0] == "not_exist":
                # Still write a record with "Not Found" status
                result = {
                    "pub_id": pub_id,
                    "class_id": 1,
                    "Rank": "Not Found",
                    "URL": ""
                }
                save_ranking_result(result, output_file)
                return False

            base_url = "https://portal.core.edu.au/conf-ranks/"

            for conference_name in conference_names:
                if not conference_name:
                    continue
                    
                url = f"{base_url}?search={conference_name}&by=all&source=CORE2023&sort=atitle&page=1"

                try:
                    # Envoyer la requête GET
                    response = requests.get(url)
                    response.raise_for_status()  # Vérifier les erreurs HTTP
                    
                except requests.exceptions.RequestException as e:
                    print(f"Error fetching data for {conference_name}: {e}")
                    continue  # Passer à la prochaine conférence

                # Parse HTML content
                try:
                    soup = BeautifulSoup(response.text, 'html.parser')

                    # Trouver la table de classement
                    table = soup.find("table")
                    if table:
                        rows = table.find_all("tr")[1:]  # Ignorer l'en-tête

                        for row in rows:
                            columns = row.find_all("td", class_="nowrap")
                            if len(columns) > 2:  # Vérifier qu'il y a assez de colonnes
                                title = columns[0].text.strip().lower()
                                rank = columns[2].text.strip()

                                result = {
                                    "pub_id": pub_id,
                                    "class_id": 1,
                                    "Rank": rank,
                                    "URL": url
                                }
                                save_ranking_result(result, output_file)
                                return True  # Sortir dès qu'un match est trouvé
                except Exception as e:
                    print(f"Error parsing response for {conference_name}: {e}")
                    continue

            # Si aucun résultat n'a été trouvé, enregistre "Not Found"
            print(f"Aucun classement trouvé pour {conference_names}.")

            result = {
                "pub_id": pub_id,
                "class_id": 1,
                "Rank": "Not Found",
                "URL": ""
            }
            save_ranking_result(result, output_file)
            return False

        def extract_qualis_data(output_file="qualis_ranks.csv"):
            # Ensure path is absolute
            output_file = get_absolute_path(output_file)
            
            url = "https://qualis.ic.ufmt.br/"
            
            # Create a placeholder file with headers if we can't extract data
            try:
                # Set up Selenium WebDriver
                options = Options()
                options.add_argument("--headless")  # Run in headless mode
                options.add_argument("--disable-gpu")
                options.add_argument("--no-sandbox")
                
                try:
                    service = Service(ChromeDriverManager().install())
                    driver = webdriver.Chrome(service=service, options=options)
                except Exception as e:
                    print(f"Error initializing Chrome driver: {e}")
                    # Create empty file with headers
                    pd.DataFrame(columns=['Name', 'Acronym', 'Rank']).to_csv(output_file, index=False)
                    return False
                
                try:
                    driver.get(url)
                    page_source = driver.page_source
                except Exception as e:
                    print(f"Error loading page {url}: {e}")
                    pd.DataFrame(columns=['Name', 'Acronym', 'Rank']).to_csv(output_file, index=False)
                    return False
                finally:
                    driver.quit()  # Ensure the driver is closed
                
                soup = BeautifulSoup(page_source, 'html.parser')
                body = soup.find('tbody')
                
                if not body:
                    print("No data found on the page")
                    pd.DataFrame(columns=['Name', 'Acronym', 'Rank']).to_csv(output_file, index=False)
                    return False
                
                items = body.find_all('tr')
                data = []
                
                for item in items:
                    tds = item.find_all('td')
                    if len(tds) < 3:
                        continue  # Skip if not enough columns
                    
                    title = tds[1].text.strip()
                    acronym = tds[0].text.strip()
                    rank = tds[2].text.strip()
                    
                    data.append({
                        'Name': title,
                        'Acronym': acronym,
                        'Rank': rank
                    })
                
                df = pd.DataFrame(data)
                df.to_csv(output_file, index=False)
                print(f"Extracted {len(data)} conference rankings and saved to {output_file}")
                return True
            except Exception as e:
                print(f"Error in extract_qualis_data: {e}")
                # Create empty file with headers
                pd.DataFrame(columns=['Name', 'Acronym', 'Rank']).to_csv(output_file, index=False)
                return False

        def search_qualis(conference_names, pub_id, input_file=QUALIS_CACHE_FILE, output_file=classment_output):
            """ Recherche une conférence dans la liste des noms fournis et sauvegarde le meilleur résultat. """
            
            # Always generate a record, even if pub_id is missing
            if not pub_id or pub_id == "unknown_id":
                result = {
                    "pub_id": pub_id if pub_id else "unknown_id",
                    "class_id": 4,
                    "Rank": "Not Found",
                    "URL": ""
                }
                save_ranking_result(result, output_file)
                return False

            # If conference names is empty or contains placeholder
            if not conference_names or conference_names[0] == "not_exist":
                result = {
                    "pub_id": pub_id,
                    "class_id": 4,
                    "Rank": "Not Found",
                    "URL": ""
                }
                save_ranking_result(result, output_file)
                return False

            # Make sure we have Qualis data
            if not ospath.exists(input_file) or ospath.getsize(input_file) == 0:
                extract_qualis_data_with_cache(input_file)

            try:
                df = pd.read_csv(input_file)
                if df.empty:
                    extract_qualis_data_with_cache(input_file)
                    df = pd.read_csv(input_file)
            except Exception as e:
                print(f"Error reading Qualis data: {e}")
                df = pd.DataFrame(columns=['Name', 'Acronym', 'Rank'])

            # Vérification que les colonnes nécessaires existent
            required_columns = {"Acronym", "Name", "Rank"}
            if not required_columns.issubset(df.columns):
                print(f"Error: {input_file} does not contain required columns {required_columns}.")
                result = {
                    "pub_id": pub_id,
                    "class_id": 4,
                    "Rank": "Not Found",
                    "URL": ""
                }
                save_ranking_result(result, output_file)
                return False

            found_result = None

            # Parcours des noms de conférences fournis
            for conf_name in conference_names:
                if not conf_name or conf_name == "not_exist":
                    continue
                    
                try:
                    if len(conf_name) <= 6:
                        # Recherche uniquement dans les acronymes si le nom est court
                        results = df[df["Acronym"].str.lower() == conf_name.lower()]
                    else:
                        # Recherche dans les acronymes et noms complets
                        results = df[
                            (df["Name"].str.contains(conf_name, case=False, na=False)) |
                            (df["Acronym"].str.lower() == conf_name.lower())
                        ]

                    if not results.empty:
                        best_match = results.iloc[0]  # Prendre le premier résultat trouvé
                        found_result = {
                            "pub_id": pub_id,
                            "class_id": 4,
                            "Rank": best_match["Rank"],
                            "URL": "https://qualis.ic.ufmt.br/"
                        }
                        break  # Sortir de la boucle dès qu'un résultat est trouvé
                except Exception as e:
                    print(f"Error searching for conference {conf_name}: {e}")
                    continue

            # Si aucun résultat n'a été trouvé, on enregistre "Not Found"
            if found_result is None:
                found_result = {
                    "pub_id": pub_id,
                    "class_id": 4,
                    "Rank": "Not Found",
                    "URL": ""
                }

            # Sauvegarde du résultat dans le fichier
            save_ranking_result(found_result, output_file)
            return found_result["Rank"] != "Not Found"

        # Download PDF function
        def download_pdf(url, filename):
            # Ensure path is absolute
            filename = get_absolute_path(filename)
            
            if ospath.exists(filename):
                print(f"✅ {filename} already exists.")
                return True
                
            try:
                response = requests.get(url, stream=True, verify=False)
                if response.status_code == 200:
                    # Create the directory if it doesn't exist
                    os.makedirs(ospath.dirname(filename), exist_ok=True)
                    
                    with open(filename, "wb") as file:
                        for chunk in response.iter_content(1024):
                            file.write(chunk)
                    print(f"✅ PDF downloaded successfully as '{filename}'")
                    return True
                else:
                    print(f"❌ Failed to download {filename}: HTTP {response.status_code}")
                    # Create empty PDF to avoid repeated download attempts
                    os.makedirs(ospath.dirname(filename), exist_ok=True)
                    with open(filename, "wb") as file:
                        file.write(b"%PDF-1.4\n%EOF\n")
                    return False
            except Exception as e:
                print(f"❌ Error downloading {filename}: {e}")
                # Create empty PDF to avoid repeated download attempts
                try:
                    os.makedirs(ospath.dirname(filename), exist_ok=True)
                    with open(filename, "wb") as file:
                        file.write(b"%PDF-1.4\n%EOF\n")
                except Exception as write_err:
                    print(f"Failed to create empty PDF: {write_err}")
                return False

        # Fonction pour extraire le texte d'un PDF
        def extract_text_from_pdf(pdf_file):
            # Ensure path is absolute
            pdf_file = get_absolute_path(pdf_file)
            
            if not ospath.exists(pdf_file):
                print(f"❌ PDF file {pdf_file} does not exist.")
                return ""
                
            try:
                with open(pdf_file, "rb") as f:
                    try:
                        reader = PyPDF2.PdfReader(f)
                        text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
                        return text.lower()
                    except Exception as e:
                        print(f"❌ Error reading PDF {pdf_file}: {e}")
                        return ""
            except Exception as e:
                print(f"❌ Error opening PDF {pdf_file}: {e}")
                return ""

        # Fonction pour faire une correspondance floue
        def fuzzy_search(journal_name, text, threshold=0.8):
            if not journal_name or not text:
                return None
                
            try:
                words = text.split()
                matches = difflib.get_close_matches(journal_name, words, n=1, cutoff=threshold)
                return matches[0] if matches else None
            except Exception as e:
                print(f"❌ Error in fuzzy search for {journal_name}: {e}")
                return None

        # Scimago functions
        def download_scimago():
            SCIMAGO_URL = "https://www.scimagojr.com/journalrank.php?out=xls"
            HEADERS = {'User-Agent': 'Mozilla/5.0'}
            SCIMAGO_FILE = str(SCRIPT_DIR / "scimago_downloaded_file.xls")
            
            if ospath.exists(SCIMAGO_FILE):
                print(f"Le fichier {SCIMAGO_FILE} existe deja.")
                return True
            try:
                print("📥 Téléchargement du fichier Scimago en cours...")
                response = requests.get(SCIMAGO_URL, headers=HEADERS, timeout=20)
                if response.status_code == 200:
                    # Create directory if needed
                    os.makedirs(ospath.dirname(SCIMAGO_FILE), exist_ok=True)
                    
                    with open(SCIMAGO_FILE, "wb") as f:
                        f.write(response.content)
                    print("✅ Fichier Scimago téléchargé avec succès !")
                    return True
                else:
                    print(f"❌ Erreur lors du téléchargement : Code {response.status_code}")
                    # Create an empty file to avoid further download attempts
                    os.makedirs(ospath.dirname(SCIMAGO_FILE), exist_ok=True)
                    with open(SCIMAGO_FILE, "w") as f:
                        f.write("")
                    return False
            except Exception as e:
                print(f"❌ Erreur lors du téléchargement : {str(e)}")
                # Create an empty file to avoid further download attempts
                try:
                    os.makedirs(ospath.dirname(SCIMAGO_FILE), exist_ok=True)
                    with open(SCIMAGO_FILE, "w") as f:
                        f.write("")
                except Exception as write_err:
                    print(f"Failed to create empty Scimago file: {write_err}")
                return False

        def load_scimago_data():
            SCIMAGO_FILE = str(SCRIPT_DIR / "scimago_downloaded_file.xls")
            
            if not ospath.exists(SCIMAGO_FILE):
                print(f"❌ Erreur : Le fichier {SCIMAGO_FILE} n'existe pas.")
                return pd.DataFrame()

            try:
                scimago_df = pd.read_csv(SCIMAGO_FILE, sep=";", encoding="latin1", on_bad_lines='skip')
                print("✅ Fichier Scimago chargé avec succès !")
                return scimago_df
            except Exception as e:
                print(f"❌ Erreur lors de la lecture du fichier Scimago : {str(e)}")
                return pd.DataFrame()

        # Starting main execution
        # Ensure necessary directory structure exists
        final_outpout_dir = ospath.dirname(get_absolute_path(final_outpout))
        classment_output_dir = ospath.dirname(get_absolute_path(classment_output))
        
        os.makedirs(final_outpout_dir, exist_ok=True)
        os.makedirs(classment_output_dir, exist_ok=True)
        
        # Print directories for debugging
        print(f"Script directory: {SCRIPT_DIR}")
        print(f"Final output directory: {final_outpout_dir}")
        print(f"Classment output directory: {classment_output_dir}")
        
        # Create files with headers if they don't exist
        final_outpout_abs = get_absolute_path(final_outpout)
        classment_output_abs = get_absolute_path(classment_output)
        
        if not ospath.exists(final_outpout_abs):
            with open(final_outpout_abs, mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                writer.writeheader()
        
        if not ospath.exists(classment_output_abs):
            with open(classment_output_abs, mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.writer(csv_file)
                writer.writerow(["pub_id", "class_id", "Rank", "URL"])
        
        # Proceed with execution using cached data
        conference_name = extract_publications_structured(final_outpout)
        
        # Get Qualis data from cache or download fresh
        extract_qualis_data_with_cache()
        
        # Get PDF data from cache or extract fresh
        URL_A = "https://dgrsdt.dz/storage/revue/A/2023/A.pdf"
        URL_B = "https://dgrsdt.dz/storage/revue/B/2023/ABDC.pdf"
        PDF_A = str(SCRIPT_DIR / "revues_A.pdf")
        PDF_B = str(SCRIPT_DIR / "revues_B.pdf")
        
        pdf_data = extract_pdf_data_with_cache(URL_A, URL_B, PDF_A, PDF_B)
        
        # Process publications
        processed_pub_ids = set()  # Store already processed pub_id values

        for names in conference_name:
            pub_id = names[0]
            
            if not pub_id:
                pub_id = "unknown_id"
            
            if pub_id in processed_pub_ids:
                continue  # Skip if already processed

            processed_pub_ids.add(pub_id)  # Mark as processed

            name = extract_combined_substrings(names[1])
            
            # Process even if name is empty
            get_core_conference_ranking(name, pub_id)
            search_qualis(name, pub_id)

        # Scimago processing with cache
        download_scimago_with_cache()
        scimago_df = load_scimago_data_with_cache()
        
        # Process publications with Scimago
        MERGED_PUBLICATIONS = get_absolute_path(final_outpout)
        OUTPUT_FILE = str(SCRIPT_DIR / "ScimagoMerging.csv")
        RESULTS_FILE = get_absolute_path(classment_output)
        
        # Process with Scimago data
        try:
            merged_df = pd.read_csv(MERGED_PUBLICATIONS, encoding="utf-8", on_bad_lines='skip')
            print("✅ Fichier merged_publications.csv chargé avec succès !")
        except Exception as e:
            print(f"❌ Erreur lors de la lecture de {MERGED_PUBLICATIONS} : {str(e)}")
            # Create a minimal dataframe to avoid total failure
            merged_df = pd.DataFrame(columns=["publication_id", "Journal", "Type"])

        # Ensure we have at least basic columns
        if "publication_id" not in merged_df.columns:
            merged_df["publication_id"] = ["unknown_id"]
        if "Journal" not in merged_df.columns:
            merged_df["Journal"] = [""]
        if "Type" not in merged_df.columns:
            merged_df["Type"] = [""]

        # Add columns for SJR and Quartile data
        merged_df["BestSJR"] = None
        merged_df["Best Quartile"] = None

        results_list = []  # List to store results before final write
        processed_pub_ids_scimago = set()

        # Process each row in the merged file
        for index, row in merged_df.iterrows():
            try:
                pub_id = row.get("publication_id", "unknown_id")
                journal_name = row.get("Journal", "")
                
                if pd.isna(pub_id) or not pub_id:
                    pub_id = "unknown_id"
                
                if pd.isna(journal_name) or not journal_name:
                    # Still add a record for missing journals
                    if pub_id not in processed_pub_ids_scimago:
                        processed_pub_ids_scimago.add(pub_id)
                        results_list.append([pub_id, 2, "Not Found", "N/A"])
                    continue
                
                if pub_id in processed_pub_ids_scimago:
                    continue  # Skip if already processed
                
                processed_pub_ids_scimago.add(pub_id)
                
                best_sjr = "N/A"
                best_quartile = "Not Found"
                scimago_url = "N/A"
                
                # Only search if we have a valid Scimago dataframe
                if not scimago_df.empty:
                    try:
                        matches = scimago_df[scimago_df["Title"].str.strip().str.lower() == journal_name.strip().lower()]
                        
                        if not matches.empty:
                            best_sjr = matches["SJR"].max()
                            best_quartile = matches.loc[matches["SJR"].idxmax(), "SJR Best Quartile"]
                            
                            # Update the merged dataframe
                            merged_df.at[index, "BestSJR"] = best_sjr
                            merged_df.at[index, "Best Quartile"] = best_quartile
                            
                            # Generate a Scimago URL
                            scimago_url = f"https://www.scimagojr.com/journalsearch.php?q={journal_name.replace(' ', '+')}"
                    except Exception as e:
                        print(f"Error processing journal {journal_name}: {e}")
                
                # Always add a result
                results_list.append([pub_id, 2, best_quartile, scimago_url])
            except Exception as e:
                print(f"Error processing row {index}: {e}")
                # Still try to add a record if possible
                try:
                    pub_id = row.get("publication_id", "unknown_id")
                    if pd.isna(pub_id) or not pub_id:
                        pub_id = "unknown_id"
                    if pub_id not in processed_pub_ids_scimago:
                        processed_pub_ids_scimago.add(pub_id)
                        results_list.append([pub_id, 2, "Not Found", "N/A"])
                except:
                    pass

        # Save results to the classment file
        if results_list:
            try:
                results_df = pd.DataFrame(results_list, columns=["pub_id", "class_id", "Rank", "URL"])
                results_df.to_csv(RESULTS_FILE, mode='a', index=False, encoding="utf-8", 
                                header=not ospath.exists(RESULTS_FILE))
                print(f"✅ Added {len(results_list)} entries to {RESULTS_FILE}.")
            except Exception as e:
                print(f"Error saving results to {RESULTS_FILE}: {e}")
                # Try direct CSV writing as fallback
                try:
                    with open(RESULTS_FILE, mode='a', newline='', encoding='utf-8') as f:
                        writer = csv.writer(f)
                        for result in results_list:
                            writer.writerow(result)
                except Exception as inner_e:
                    print(f"Failed fallback CSV write: {inner_e}")

        # Try to save the merged file
        try:
            # Ensure directory exists
            os.makedirs(ospath.dirname(OUTPUT_FILE), exist_ok=True)
            merged_df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")
            print(f"✅ File '{OUTPUT_FILE}' created successfully!")
        except Exception as e:
            print(f"Failed to save merged file to {OUTPUT_FILE}: {e}")

        # Process DGRSDT (using cached PDF data)
        INPUT_FILE = get_absolute_path(final_outpout)
        OUTPUT_FILE = get_absolute_path(classment_output)
        
        # Charger le fichier CSV
        try:
            df = pd.read_csv(INPUT_FILE, encoding="utf-8", sep=None, engine="python", on_bad_lines='skip')
        except Exception as e:
            print(f"❌ Error reading CSV file: {e}")
            # Create a minimal dataframe to avoid total failure
            df = pd.DataFrame(columns=["publication_id", "Journal", "Titre_publication"])

        # Ensure minimum required columns
        if "publication_id" not in df.columns:
            df["publication_id"] = ["unknown_id"]
        if "Journal" not in df.columns:
            df["Journal"] = [""]
        if "Titre_publication" not in df.columns:
            df["Titre_publication"] = [""]

        # Add columns for ranking and link
        df["Classement"] = "Non classé"
        df["Lien Classement"] = ""

        # Ensure the output file exists with headers
        if not ospath.exists(OUTPUT_FILE):
            # Ensure directory exists
            os.makedirs(ospath.dirname(OUTPUT_FILE), exist_ok=True)
            with open(OUTPUT_FILE, mode="w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["pub_id", "class_id", "Rank", "URL"])

        # Process all publications
        processed_pub_ids_dgrsdt = set()

        with open(OUTPUT_FILE, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            
            # Parcours des publications
            for index, row in df.iterrows():
                try:
                    # Get publication ID and journal name
                    pub_id = row[0] if len(row) > 0 else None
                    
                    # Handle missing or invalid pub_id
                    if pd.isna(pub_id) or not pub_id:
                        pub_id = "unknown_id"
                    
                    # Skip duplicate publications
                    if pub_id in processed_pub_ids_dgrsdt:
                        continue
                    
                    processed_pub_ids_dgrsdt.add(pub_id)
                    
                    # Get journal name if it exists
                    journal_name = str(row.get("Journal", "")).strip().lower() if "Journal" in row and pd.notna(row["Journal"]) else ""
                    
                    # Default values
                    classement = "Non classé"
                    classement_url = "N/A"
                    
                    # Only search if we have a valid journal name
                    if journal_name:
                        classement = search_in_cached_pdfs(journal_name, pdf_data)
                        
                        # Generate link based on classification
                        if classement == "A":
                            classement_url = URL_A
                        elif classement == "B":
                            classement_url = URL_B
                    
                    # Always write an entry for every publication
                    writer.writerow([
                        pub_id,
                        "03",
                        classement if classement else "Non classé",
                        classement_url
                    ])
                except Exception as e:
                    print(f"Error processing publication at index {index}: {e}")
                    # Try to still write an entry if possible
                    try:
                        pub_id = row[0] if len(row) > 0 else "unknown_id"
                        if pd.isna(pub_id) or not pub_id:
                            pub_id = "unknown_id"
                        
                        if pub_id not in processed_pub_ids_dgrsdt:
                            processed_pub_ids_dgrsdt.add(pub_id)
                            writer.writerow([pub_id, "03", "Error", "N/A"])
                    except:
                        pass

        print(f"✅ Classification completed! Results added to {OUTPUT_FILE}.")

    except Exception as e:
        # Catch and log the main exception
        error_message = f"Error during scraping: {str(e)}"
        print(error_message)
        
        # Write empty file with headers if we fail
        try:
            final_outpout_abs = get_absolute_path(final_outpout)
            os.makedirs(ospath.dirname(final_outpout_abs), exist_ok=True)
            with open(final_outpout_abs, mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                writer.writeheader()
        except Exception as write_error:
            print(f"Failed to create empty output file: {write_error}")
        
        try:
            classment_output_abs = get_absolute_path(classment_output)
            os.makedirs(ospath.dirname(classment_output_abs), exist_ok=True)
            with open(classment_output_abs, mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.writer(csv_file)
                writer.writerow(["pub_id", "class_id", "Rank", "URL"])
        except Exception as write_error:
            print(f"Failed to create empty classment file: {write_error}")
        
        # Try to ensure we at least have empty records for any publications found
        try:
            # Try to read the input file
            final_outpout_abs = get_absolute_path(final_outpout)
            if ospath.exists(final_outpout_abs):
                try:
                    df = pd.read_csv(final_outpout_abs, encoding="utf-8", sep=None, engine="python", on_bad_lines='skip')
                    processed_ids = set()
                    
                    classment_output_abs = get_absolute_path(classment_output)
                    os.makedirs(ospath.dirname(classment_output_abs), exist_ok=True)
                    with open(classment_output_abs, mode='a', newline='', encoding='utf-8') as csv_file:
                        writer = csv.writer(csv_file)
                        
                        for index, row in df.iterrows():
                            try:
                                pub_id = row.get("publication_id", "unknown_id")
                                if pd.isna(pub_id) or not pub_id:
                                    pub_id = "unknown_id"
                                    
                                if pub_id in processed_ids:
                                    continue
                                    
                                processed_ids.add(pub_id)
                                
                                # Write a placeholder entry for each ranking source
                                writer.writerow([pub_id, "1", "Error", ""])  # CORE
                                writer.writerow([pub_id, "2", "Error", ""])  # Scimago
                                writer.writerow([pub_id, "03", "Error", ""])  # DGRSDT
                                writer.writerow([pub_id, "4", "Error", ""])  # Qualis
                            except:
                                continue
                except Exception as read_error:
                    print(f"Failed to process existing publications: {read_error}")
        except Exception as recovery_error:
            print(f"Failed recovery attempt: {recovery_error}")
        
        # Log the error for debugging
        try:
            log_file_path = str(SCRIPT_DIR / "scraper_error.log")
            os.makedirs(ospath.dirname(log_file_path), exist_ok=True)
            with open(log_file_path, "a") as log_file:
                log_file.write(f"{datetime.datetime.now()}: {error_message}\n")
        except Exception as log_error:
            print(f"Failed to write error log: {log_error}")
        
        # Re-raise the exception to be handled by the caller
        raise 

    except Exception as e:
        print(f"Error during scraping: {str(e)}")
        # Write empty file with headers if we fail
        with open(final_outpout, mode='w', newline='', encoding='utf-8') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
        raise

if __name__ == "__main__":
    main()