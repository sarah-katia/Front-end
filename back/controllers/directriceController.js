const { Publication, Chercheur, ConfJournal, PubClassement } = require('../models');
const { exec } = require('child_process');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const os = require('os');
const cron = require('node-cron');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const PendingUser = require("../models/pendinguser");

const bcrypt = require('bcrypt');
const transporter = require('../utiles/mailer');
const jobQueue = new Map();

uploadChercheurPhoto = upload.single('photo');



// Controller for submitting registration requests
const submitRequest = async (req, res) => {
    try {
     

      const userData = { ...req.body };
      
      // Add the image URL if a file was uploaded
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file);
        userData.photo = uploadResult.url;
        userData.photoPublicId = uploadResult.public_id;
        console.log(uploadResult.url)
      }
      
      console.log(userData)
      // Create pending user record
      const pendingUser = await PendingUser.create(userData);
      
      res.status(201).json({
        success: true,
        message: "Registration request submitted successfully. Awaiting admin approval.",
        data: pendingUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error submitting registration request",
        error: error.message
      });
    }
  };
  

const addResearcherWithPublications = async (req, res) => {
    try {
      // Get text data from the request body
      const { nom_complet, chercheur_id } = req.body;  
      
      // Validate required fields
      if (!nom_complet) {
        return res.status(400).json({ message: "Complete name is required!" });
      }
      
      // Create a new object with all fields from req.body
      const chercheurData = { ...req.body };
      
      // Add the image URL if a file was uploaded
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file);
        chercheurData.photo = uploadResult.url;
        chercheurData.photoPublicId = uploadResult.public_id;
        console.log(uploadResult.url)
      }
      
      // Create the researcher in the database
      const researcher = await Chercheur.create(chercheurData);
      
      // Get the researcher's ID from the created record
    //   const chercheur_id = researcher._id || researcher.id;
      
      // Generate a job ID
      const jobId = `researcher_${chercheur_id}_${Date.now()}`;
      
      // Add job to queue with status "pending"
      jobQueue.set(jobId, {
        type: 'add_researcher',
        status: 'pending',
        started: new Date(),
        researcher: {
          id: chercheur_id,
          name: nom_complet
        },
        completed: false,
        results: null
      });
      
      // Return response with job ID (SEND ONLY ONE RESPONSE)
      res.status(202).json({
        success: true,
        message: 'Researcher created. Publication scraping started in background.',
        researcher,
        jobId,
        statusEndpoint: `/directrice/jobs/${jobId}`
      });
      
      // Run the scraping process in background AFTER sending response
      // This won't affect the response as it runs after
      console.log(chercheur_id)
      processResearcherInBackground(jobId, nom_complet, chercheur_id);
      
    } catch (err) {
      console.error(`Controller error: ${err}`);
      // Make sure we haven't already sent a response
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: err.message
        });
      }
    }
  };

// Background processing function for a single researcher
async function processResearcherInBackground(jobId, nom_complet, chercheur_id) {
    try {
        // Update job status
        const job = jobQueue.get(jobId);
        job.status = 'processing';
        
        // Prepare paths for the Python script and output CSVs
        const scriptPath = path.join(__dirname, '../scripts/researcher_scraper.py');
        const outputPath = path.join(__dirname, '../scripts', `${chercheur_id}_publications.csv`);
        const outputConfJournalPath = path.join(__dirname, '../scripts', `${chercheur_id}_ConfJournal.csv`);
        const outputTabClassmentPath = path.join(__dirname, '../scripts', `${chercheur_id}_tabClassment.csv`);

        // Execute the Python script
        console.log(`Processing researcher: ${nom_complet}`);
        const pythonCommand = `python ${scriptPath} --name "${nom_complet}" --id ${chercheur_id} --output ${outputPath} --confJournaloutput ${outputConfJournalPath} --Classmentoutput ${outputTabClassmentPath} `;
        
        exec(pythonCommand, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error}`);
                job.status = 'failed';
                job.error = error.message;
                job.completed = true;
                return;
            }

            try {
                const confJournalEntries = [];
                const publications = [];
                const classementEntries = [];
                const errors = [];
                
                // STEP 1: Process publications CSV
                let hasValidPublications = false;
                if (fs.existsSync(outputPath)) {
                    await new Promise((resolve, reject) => {
                        fs.createReadStream(outputPath)
                            .pipe(csv())
                            .on('data', (row) => {
                                const pubId = row.publication_id || Object.values(row)[0];
                                
                                // Map CSV fields to database attributes with correct field names
                                const publicationData = {
                                    publication_id: pubId,
                                    chercheur_id: row.chercheur_id,
                                    titre_publication: row.Titre_publication || 'Untitled',
                                    nombre_pages: parseInt(row.nombre_pages) || null,
                                    volumes: row.Volumes || null,
                                    lien: row.Lien || row['Lien Google Scholar'] || null,
                                    annee: extractYear(row.date_publication) || null,
                                    auteurs: row.Auteurs || null,
                                    publisher: row.Publisher || null,
                                    book: row.Book || null,
                                    editors: row.Editors || null
                                };

                                // Only add if we have at least a title or publication_id
                                if (publicationData.titre_publication || publicationData.publication_id) {
                                    publications.push(publicationData);
                                    hasValidPublications = true;
                                }
                            })
                            .on('end', resolve)
                            .on('error', reject);
                    });
                }

                if (!hasValidPublications) {
                    console.warn('No valid publications found in CSV');
                    // Clean up files
                    cleanupFiles([outputPath, outputConfJournalPath, outputTabClassmentPath]);
                    
                    job.status = 'completed';
                    job.results = {
                        publicationsCount: 0,
                        confJournalCount: confJournalEntries.length,
                        message: 'No valid publications found'
                    };
                    job.completed = true;
                    return;
                }

                // Create publications with error handling
                const createdPublications = [];
                
                // Create publications SECOND
                for (const pub of publications) {
                    try {
                        const createdPub = await Publication.create(pub);
                        createdPublications.push(createdPub);
                    } catch (dbError) {
                        errors.push({
                            publication: pub,
                            error: dbError.message
                        });
                        console.error(`Failed to create publication ${pub.publication_id}:`, dbError);
                    }
                }

                // STEP 2: Process ConfJournal CSV first
                if (fs.existsSync(outputConfJournalPath)) {
                    await new Promise((resolve, reject) => {
                        fs.createReadStream(outputConfJournalPath)
                            .pipe(csv())
                            .on('data', (row) => {
                                // Skip if no publication id
                                const pubId = row.pub_id || Object.values(row)[0];
                                if (!pubId) return;
                                
                                confJournalEntries.push({
                                    publication_id: pubId,
                                    nom: row.Nom || null,
                                    type: row.Type || null,
                                    thematique: row.Thématique || null,
                                    scope: row.Scope || null,
                                    lieu: row.Lieu || null,
                                    periode: row.Période || null,
                                    periodicite: row.Périodicité || null
                                });
                            })
                            .on('end', resolve)
                            .on('error', reject);
                    });

                    // Create ConfJournal entries FIRST
                   
                    if (confJournalEntries.length > 0) {
                        try {
                            await ConfJournal.bulkCreate(confJournalEntries, {
                                ignoreDuplicates: true
                            });
                            console.log(`Created ${confJournalEntries.length} ConfJournal entries`);
                        } catch (confJournalError) {
                            console.error('Error creating ConfJournal entries:', confJournalError);
                            errors.push({
                                type: 'ConfJournal',
                                error: confJournalError.message
                            });
                        }
                    }
                }
                
                // STEP 3: Process Classement CSV if it exists
                if (fs.existsSync(outputTabClassmentPath)) {
                    await new Promise((resolve, reject) => {
                        fs.createReadStream(outputTabClassmentPath)
                            .pipe(csv())
                            .on('data', (row) => {
                                
                                classementEntries.push({
                                    publication_id: row.pub_id,
                                    class_id: parseInt(row.class_id) || 0,
                                    classement: row.Rank || null,  // Use Rank from CSV to match model's classement
                                    lien_vers_classement: row.URL || null  // Use URL from CSV to match model's lien_vers_classement
                                });
                            })
                            .on('end', resolve)
                            .on('error', reject);
                    });
                    
                    // Create PubClassement entries THIRD
                    if (classementEntries.length > 0) {
                        try {
                            
                            await PubClassement.bulkCreate(classementEntries, {
                                ignoreDuplicates: true
                            });
                            console.log(`Created ${classementEntries.length} PubClassement entries`);
    
    // Add verification
    const count = await PubClassement.count();
    console.log(`Actual entries in PubClassement table: ${count}`);
                        } catch (classementError) {
                            console.error('Error creating PubClassement entries:', classementError);
                            errors.push({
                                type: 'PubClassement',
                                error: classementError.message
                            });
                        }
                    }
                }
                
                
                
                // Update job status
                job.status = 'completed';
                job.results = {
                    publicationsCount: createdPublications.length,
                    confJournalCount: confJournalEntries.length,
                    classementCount: classementEntries.length,
                    errors: errors.length > 0 ? errors : undefined,
                    message: `Added ${createdPublications.length} publications, ${confJournalEntries.length} conference/journal entries, and ${classementEntries.length} classification entries` +
                        (errors.length > 0 ? ` with ${errors.length} errors` : '')
                };
                job.completed = true;
             
                // Clean up - remove all temporary CSV files
                cleanupFiles([outputPath, outputConfJournalPath, outputTabClassmentPath]);
                
            } catch (processError) {
                console.error(`Processing error: ${processError}`);
                job.status = 'failed';
                job.error = processError.message;
                job.completed = true;
                
                // Clean up files even on error
                cleanupFiles([outputPath, outputConfJournalPath, outputTabClassmentPath]);
            }
        });
    } catch (backgroundError) {
        console.error(`Background processing error: ${backgroundError}`);
        const job = jobQueue.get(jobId);
        if (job) {
            job.status = 'failed';
            job.error = backgroundError.message;
            job.completed = true;
        }
    }
}

// Helper function to clean up files
function cleanupFiles(filePaths) {
    filePaths.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Deleted: ${filePath}`);
            } catch (err) {
                console.error(`Failed to delete ${filePath}:`, err);
            }
        }
    });
}



// Refactored updatePublications function to process all researchers at once in background
const updatePublications = async (req, res) => {
    try {
        // 1. Get only active researchers from database
        const researchers = await Chercheur.findAll({
            attributes: ['chercheur_id', 'nom_complet'],
            where: {
                Statut: 'actif' // Only fetch active researchers
            },
            raw: true
        });

        if (!researchers.length) {
            return res.status(200).json({
                success: true,
                message: 'No active researchers found in database',
                updated: 0
            });
        }

        // 2. Generate a job ID
        const jobId = `update_all_${Date.now()}`;
        
        // 3. Add job to queue with status "pending"
        jobQueue.set(jobId, {
            type: 'update_all',
            status: 'pending',
            started: new Date(),
            researcherCount: researchers.length,
            completed: false,
            results: null
        });

        // 4. Return immediate response with job ID
        res.status(202).json({
            success: true,
            message: 'Publication update started in background',
            researcherCount: researchers.length,
            jobId,
            statusEndpoint: `/directrice/jobs/${jobId}`
        });

        // 5. Run the update process in background
        updatePublicationsInBackground(jobId, researchers);
        
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({
            success: false,
            message: 'Update failed',
            error: err.message
        });
    }
};

// Background processing function for bulk updating
async function updatePublicationsInBackground(jobId, researchers) {
    try {
        // Update job status
        const job = jobQueue.get(jobId);
        job.status = 'processing';
        
        // Create temp directory for files (outside project to avoid nodemon restart)
        const tempDir = path.join(os.tmpdir(), 'researcher_update_' + Date.now());
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Create researchers JSON file in temp directory
        const researchersJson = JSON.stringify(researchers.map(r => ({
            nom_complet: r.nom_complet,
            chercheur_id: r.chercheur_id
        })));
        const researchersFile = path.join(tempDir, 'researchers.json');
        fs.writeFileSync(researchersFile, researchersJson);
        
        // Set output files in temp directory
        const outputPath = path.join(tempDir, 'all_publications.csv');
        const confJournalOutputPath = path.join(tempDir, 'all_confjournal.csv');
        const classementOutputPath = path.join(tempDir, 'all_classement.csv');

        // Execute the Python script with the file path
        const scriptPath = path.join(__dirname, '../scripts/MAJ.py');
        const MAJyear = 1900;
        const pythonCommand = `python ${scriptPath} --researchers-file "${researchersFile}" --output "${outputPath}" --confJournaloutput "${confJournalOutputPath}" --Classmentoutput "${classementOutputPath}" --MAJyear "${MAJyear}"`;
        
        console.log(`Processing ${researchers.length} researchers at once`);
        
        exec(pythonCommand, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error}`);
                console.error(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                
                // Clean up temp directory
                cleanupTempDir(tempDir);
                
                job.status = 'failed';
                job.error = error.message;
                job.completed = true;
                return;
            }

            try {
                // Initialize results tracker
                const results = [];
                let totalNewPublications = 0;
                let totalNewConfJournal = 0;
                let totalNewClassement = 0;
                const errors = [];
                
                // Initialize result objects for all researchers
                researchers.forEach(researcher => {
                    results.push({
                        researcherId: researcher.chercheur_id,
                        researcherName: researcher.nom_complet,
                        status: 'actif',
                        newPublications: 0,
                        error: null
                    });
                });
                
                // Check if output file exists
                if (!fs.existsSync(outputPath)) {
                    console.warn("Output file not found:", outputPath);
                    
                    // Clean up temp directory
                    cleanupTempDir(tempDir);
                    
                    job.status = 'failed';
                    job.error = 'Script execution failed - no output file generated';
                    job.stdout = stdout;
                    job.stderr = stderr;
                    job.completed = true;
                    return;
                }
                
                // STEP 1: Process publications
                const publicationsMap = new Map();
                
                // Read publications CSV data
                await new Promise((resolve, reject) => {
                    fs.createReadStream(outputPath)
                        .pipe(csv())
                        .on('data', (row) => {
                            const chercheurId = row.chercheur_id;
                            if (!chercheurId) return;
                            
                            if (!publicationsMap.has(chercheurId)) {
                                publicationsMap.set(chercheurId, []);
                            }
                            
                            publicationsMap.get(chercheurId).push({
                                publication_id: row.publication_id || Object.values(row)[0],
                                chercheur_id: row.chercheur_id,
                                titre_publication: row.Titre_publication || 'Untitled',
                                nombre_pages: parseInt(row.nombre_pages) || null,
                                volumes: row.Volumes || null,
                                lien: row.Lien || row['Lien Google Scholar'] || null,
                                annee: extractYear(row.date_publication) || null,
                                auteurs: row.Auteurs || null,
                                publisher: row.Publisher || null,
                                book: row.Book || null,
                                editors: row.Editors || null
                            });
                        })
                        .on('end', resolve)
                        .on('error', reject);
                });
                
                // Process all publications in bulk SECOND
                const allPublications = [];
                
                // Check each researcher's publications against existing ones
                for (const [chercheurId, publications] of publicationsMap.entries()) {
                    // Get existing publications for this researcher
                    const existingPublications = await Publication.findAll({
                        where: { 
                            chercheur_id: chercheurId,
                            publication_id: publications.map(p => p.publication_id)
                        },
                        attributes: ['publication_id'],
                        raw: true
                    });
                    
                    const existingIds = existingPublications.map(p => p.publication_id);
                    const newPublications = publications.filter(
                        p => !existingIds.includes(p.publication_id)
                    );
                    
                    // Add to bulk insertion array
                    allPublications.push(...newPublications);
                    
                    // Update researcher result
                    const resultIndex = results.findIndex(r => r.researcherId === chercheurId);
                    if (resultIndex !== -1) {
                        results[resultIndex].newPublications = newPublications.length;
                        totalNewPublications += newPublications.length;
                    }
                }
                
                // Bulk insert all new publications
                if (allPublications.length > 0) {
                    try {
                        await Publication.bulkCreate(allPublications);
                        console.log(`Created ${allPublications.length} new publications`);
                    } catch (pubError) {
                        console.error('Error creating publications:', pubError);
                        errors.push({
                            type: 'Publications',
                            error: pubError.message
                        });
                    }
                }

                // STEP 2: First process ConfJournal data
                const confJournalEntries = [];
                
                // Read ConfJournal CSV if it exists
                if (fs.existsSync(confJournalOutputPath)) {
                    await new Promise((resolve, reject) => {
                        fs.createReadStream(confJournalOutputPath)
                            .pipe(csv())
                            .on('data', (row) => {
                                const pubId = row.pub_id || Object.values(row)[0];
                                if (!pubId) return;
                                
                                confJournalEntries.push({
                                    publication_id: pubId,
                                    nom: row.Nom || null,
                                    type: row.Type || null,
                                    thematique: row.Thématique || null,
                                    scope: row.Scope || null,
                                    lieu: row.Lieu || null,
                                    periode: row.Période || null,
                                    periodicite: row.Périodicité || null
                                });
                            })
                            .on('end', resolve)
                            .on('error', reject);
                    });

                    // Process ConfJournal entries 
                    if (confJournalEntries.length > 0) {
                        try {
                            // Check existing entries
                            const existingConfJournals = await ConfJournal.findAll({
                                where: { publication_id: confJournalEntries.map(c => c.publication_id) },
                                attributes: ['publication_id'],
                                raw: true
                            });
                            
                            const existingConfIds = existingConfJournals.map(c => c.publication_id);
                            const newConfJournals = confJournalEntries.filter(
                                c => !existingConfIds.includes(c.publication_id)
                            );
                            
                            console.log(newConfJournals);
                            if (newConfJournals.length > 0) {
                                await ConfJournal.bulkCreate(newConfJournals, {
                                    ignoreDuplicates: true
                                });
                                totalNewConfJournal = newConfJournals.length;
                                console.log(`Created ${newConfJournals.length} new ConfJournal entries`);
                            }
                        } catch (confJournalError) {
                            console.error('Error creating ConfJournal entries:', confJournalError);
                            errors.push({
                                type: 'ConfJournal',
                                error: confJournalError.message
                            });
                        }
                    }
                }
                
                
                // STEP 3: Process Classement CSV if it exists
                const classementEntries = [];
                
                if (fs.existsSync(classementOutputPath)) {
                    await new Promise((resolve, reject) => {
                        fs.createReadStream(classementOutputPath)
                            .pipe(csv())
                            .on('data', (row) => {
                                if (!row.pub_id || !row.class_id) return;
                                
                                classementEntries.push({
                                    publication_id: row.pub_id || Object.values(row)[0],
                                    class_id: parseInt(row.class_id) || 0,
                                    classement: row.Rank || null,  // Change from classement_value to match DB field
                                    lien_vers_classement: row.URL || null  // Change from Lien_classement to match DB field
                                });
                            })
                            .on('end', resolve)
                            .on('error', reject);
                    });
                    
                    // Process Classement entries THIRD
                    if (classementEntries.length > 0) {
                        try {
                            // Check existing entries
                            const existingClassements = await PubClassement.findAll({
                                where: {
                                    publication_id: classementEntries.map(c => c.publication_id),
                                    class_id: classementEntries.map(c => c.class_id)
                                },
                                attributes: ['publication_id', 'class_id'],
                                raw: true
                            });
                            
                            const existingClassMap = new Map();
                            existingClassements.forEach(c => {
                                existingClassMap.set(`${c.publication_id}_${c.class_id}`, true);
                            });
                            
                            const newClassements = classementEntries.filter(
                                c => !existingClassMap.has(`${c.publication_id}_${c.class_id}`)
                            );
                            
                            if (newClassements.length > 0) {
                                await PubClassement.bulkCreate(newClassements, {
                                    ignoreDuplicates: true
                                });
                                totalNewClassement = newClassements.length;
                                console.log(`Created ${newClassements.length} new classification entries`);
                            }
                        } catch (classementError) {
                            console.error('Error creating PubClassement entries:', classementError);
                            errors.push({
                                type: 'PubClassement',
                                error: classementError.message
                            });
                        }
                    }
                }
                
                // Clean up temp directory
                cleanupTempDir(tempDir);
                
                // Update job status
                job.status = 'completed';
                job.results = {
                    researchersProcessed: researchers.length,
                    totalNewPublications,
                    totalNewConfJournal,
                    totalNewClassement,
                    errors: errors.length > 0 ? errors : undefined,
                    details: results
                };
                job.completed = true;
                
            } catch (dbErr) {
                console.error('DB processing error:', dbErr);
                
                // Clean up temp directory even on error
                cleanupTempDir(tempDir);
                
                job.status = 'failed';
                job.error = dbErr.message;
                job.completed = true;
            }
        });
    } catch (backgroundError) {
        console.error(`Background processing error: ${backgroundError}`);
        const job = jobQueue.get(jobId);
        if (job) {
            job.status = 'failed';
            job.error = backgroundError.message;
            job.completed = true;
        }
    }
}

// Helper function to extract year from a date string
function extractYear(dateString) {
    if (!dateString) return null;
    
    // Try to match a year pattern (4 digits)
    const yearMatch = dateString.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
        return parseInt(yearMatch[0]);
    }
    
    // If no year found, try parsing as date
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.getFullYear();
        }
    } catch (e) {
        // Ignore parse errors
    }
    
    return null;
}

// Helper function to clean up temporary directory
function cleanupTempDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        try {
            // Remove all files in the directory
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                fs.unlinkSync(path.join(dirPath, file));
            }
            
            // Remove the directory itself
            fs.rmdirSync(dirPath);
            console.log(`Cleaned up temporary directory: ${dirPath}`);
        } catch (err) {
            console.error(`Failed to clean up temporary directory ${dirPath}:`, err);
        }
    }
}
// New endpoint to check job status
const getJobStatus = async (req, res) => {
    const { jobId } = req.params;
    
    if (!jobQueue.has(jobId)) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }
    
    const job = jobQueue.get(jobId);
    
    // Cleanup completed jobs older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    for (const [id, queuedJob] of jobQueue.entries()) {
        if (queuedJob.completed && queuedJob.started < oneHourAgo) {
            jobQueue.delete(id);
        }
    }
    
    return res.status(200).json({
        success: true,
        job: {
            id: jobId,
            type: job.type,
            status: job.status,
            started: job.started,
            completed: job.completed,
            results: job.results,
            error: job.error
        }
    });
};

// Scheduled job function to run publications update automatically
function scheduleAutomaticUpdates() {
    // Schedule task to run once a year on January 1st at 00:00
    cron.schedule('0 0 1 1 *', () => {
        console.log('Running scheduled yearly publication update');
        
        // Generate a job ID for the scheduled task
        const jobId = `scheduled_update_${Date.now()}`;
        
        // Initialize researchers - will be populated in the function
        const researchers = [];
        
        // Create job record
        jobQueue.set(jobId, {
            type: 'scheduled_update',
            status: 'pending',
            started: new Date(),
            researcherCount: 0,
            completed: false,
            results: null
        });
        
        // Call a wrapper function that fetches researchers then runs the update
        runScheduledUpdate(jobId);
        
        console.log(`Scheduled update started with job ID: ${jobId}`);
    });
    
    console.log('Automatic publication updates scheduled');
}

// Wrapper function to run the update without HTTP request/response
async function runScheduledUpdate(jobId) {
    try {
        // Get active researchers from database
        const researchers = await Chercheur.findAll({
            attributes: ['chercheur_id', 'nom_complet'],
            where: {
                Statut: 'actif'
            },
            raw: true
        });
        
        // Update job with researcher count
        const job = jobQueue.get(jobId);
        job.researcherCount = researchers.length;
        
        if (!researchers.length) {
            // Complete job early if no researchers
            job.status = 'completed';
            job.completed = true;
            job.results = {
                researchersProcessed: 0,
                message: 'No active researchers found'
            };
            console.log('Scheduled update found no active researchers');
            return;
        }
        
        // Run the background process with the job ID and researchers
        updatePublicationsInBackground(jobId, researchers);
        
    } catch (err) {
        console.error('Scheduled update error:', err);
        
        // Update job status on error
        const job = jobQueue.get(jobId);
        if (job) {
            job.status = 'failed';
            job.error = err.message;
            job.completed = true;
        }
    }
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

async function createAssistant(req, res) {
  try {
    // Vérification du rôle
  if (req.user?.Rôle !== 'Directeur') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les directeurs peuvent créer des assistants.'
      });
    }

    // Données du corps de la requête
    const { Mails, Tél, chercheur_id } = req.body;
    const Rôle = 'Assistant'; // Rôle imposé

    // Validation des champs
    if (!Mails) {
      return res.status(400).json({
        status: 'error',
        message: 'Le champ "Mails" est requis.',
        error: 'Champs manquants'
      });
    }

    if (!isValidEmail(Mails)) {
      return res.status(400).json({
        status: 'error',
        message: "Format d'email invalide.",
        error: 'Email regex failed'
      });
    }

    // Vérifie si un utilisateur existe déjà
    const existingUser = await Utilisateur.findOne({ where: { Mails } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Un compte avec cet e-mail existe déjà.',
        error: 'Utilisateur existant'
      });
    }

    // Génère un mot de passe aléatoire
    const plainPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Génère un nouvel ID utilisateur (si ce champ n'est pas auto-incrémenté)
    const count = await Utilisateur.count();
    const utilisateurId = count + 1;

    // Création de l'utilisateur
    const utilisateur = await Utilisateur.create({
      utilisateur_id: utilisateurId,
      Mails,
      password: hashedPassword,
      Tél,
      chercheur_id: chercheur_id || null,
      Rôle
    });

    // Envoi de l'e-mail avec le mot de passe
    try {
      await transporter.sendMail({
        from: '"ESI Auth System" <lmcslabo@gmail.com>',
        to: Mails,
        subject: 'Votre compte Assistant a été créé',
        html: `<p>Bonjour,<br><br>Votre mot de passe est : <b>${plainPassword}</b><br><br>Merci.</p>`
      });
    } catch (err) {
      console.error('[EMAIL] Échec de l’envoi de l’email :', err);
      // Optionnel : tu peux choisir de continuer même si l'email échoue
    }

    return res.status(201).json({
      status: 'success',
      message: 'Compte Assistant créé et email envoyé.',
      data: { utilisateur_id: utilisateur.utilisateur_id }
    });

  } catch (error) {
    console.error('[CREATE ASSISTANT] Erreur serveur :', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la création du compte.',
      error: error.message
    });
  }
}


module.exports = {
    createAssistant,
    getAssistants,
    updatePublications,
    addResearcherWithPublications,
    getJobStatus,
    scheduleAutomaticUpdates,
    uploadChercheurPhoto,
    submitRequest
};