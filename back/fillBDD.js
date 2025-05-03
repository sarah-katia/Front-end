const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('./config/database'); // Adjust path as needed
const Chercheur = require('./models/chercheur.model');
const Publication = require('./models/publication.model');
const ConfJournal = require('./models/conf_journal.model');
const Classement = require('./models/classement.model');
const PubClassement = require('./models/pub_classement.model');

function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Function to truncate strings to a specified length
function truncateString(str, maxLength) {
  if (!str){ 
    if(str == null) console.log('\nWTF\n');
    console.log(String(str));
    return str;}
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

// Column length limits based on your database schema
const columnLimits = {
  Scope: 255, // Adjust this value based on your actual database column definition
  Thématique: 255,
  Lieu: 255,
  Période: 255,
  Périodicité: 255,
  Nom: 255
};

async function importCSV(filePath, model, transformer, options = {}) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .on('error', (error) => {
        console.error('File read error:', error);
        reject(error);
      })
      .pipe(csv())
      .on('data', (data) => {
        try {
          const transformedData = transformer(data);
          
          // Basic validation - check for required fields
          if (options.requiredFields) {
            const missingFields = options.requiredFields.filter(field => !transformedData[field]);
            if (missingFields.length > 0) {
              console.warn(`Skipping record (missing required fields: ${missingFields.join(', ')}):`, data);
              return;
            }
          }
          
          results.push(transformedData);
        } catch (transformError) {
          console.error('Data transformation error:', transformError, 'for row:', data);
        }
      })
      .on('end', async () => {
        try {
          if (results.length === 0) {
            console.warn(`No valid data found for ${model.name}. Check CSV format and transformer.`);
            resolve([]);
            return;
          }
          
          const result = await model.bulkCreate(results, {
            updateOnDuplicate: options.updateOnDuplicate || Object.keys(results[0] || {}).filter(key => key !== model.primaryKeyAttribute),
            validate: true,
            logging: false
          });
          console.log(`Successfully imported ${result.length} records to ${model.name}!`);
          resolve(result);
        } catch (insertError) {
          console.error(`Database insertion error for ${model.name}:`, insertError);
          reject(insertError);
        }
      });
  });
}

// Data transformers for each model


const transformers = {
  Chercheur: (data) => ({
    
    chercheur_id: data.chercheur_id,
    nom_complet: truncateString(data.nom_complet, columnLimits.Nom || 255),
    Mails: data.email,
    Tél: data.tel,
    Diplôme: data.diplome,
    Etablissement_origine: data.etablissement_origine,
    Qualité: data.qualite,
    Grade_Recherche: data.grade_recherche,
    Statut: data.statut || null,
    Hindex: safeParseInt(data['Indice h']),
    Equipe: data.equipe,
    Chef_Equipe: data.chef_E === 'TRUE',
    Grade_Enseignemet: data.grade_enseignement,
    Orcid:data.ORCID,
    Lien_GoogleScholar:data['Lien Google Scholar'] || null ,
    Lien_DBLP:data['Lien DBLP'] || null,
    photo: data.photo || null
  }),

  Publication: (data) => ({
    publication_id: data.publication_id,
    chercheur_id: data.chercheur_id,
    titre_publication: truncateString(data.Titre_publication, columnLimits.Nom || 255),
    nombre_pages: safeParseInt(data.nombre_pages),
    volumes:data.Volumes,
    lien: data.Lien,
    annee: safeParseInt(data.date_publication),
    auteurs : data.Auteurs,
    publisher : data.Publisher,
    book : data.Book,
    editors : data.Editors
  }),
 


  ConfJournal: (data) => {
    // Find the first column value (regardless of header name)
    const firstColumnValue = Object.values(data)[0];
    
    return {
      publication_id: firstColumnValue, // Use the first column value as pub_id
      nom: truncateString(data.Nom, columnLimits.Nom || 255),
      type: data.Type,
      thematique: truncateString(data.Thématique, columnLimits.Thématique || 255),
      scope: truncateString(data.Scope, columnLimits.Scope || 255),
      lieu: truncateString(data.Lieu, columnLimits.Lieu || 255),
      periode: truncateString(data.Période, columnLimits.Période || 100),
      periodicite: truncateString(data.Périodicité, columnLimits.Périodicité || 100)
    };
  },
  
  Classement: (data) => ({
    class_id: data.class_id,
    Nom: truncateString(data.Nom, columnLimits.Nom || 255),
    Type: data.Type,
  }),
  
  PubClassement: (data) => ({
    publication_id: data.publication_id,
    class_id: data.class_id,
    classement: data.Rank,
    lien_vers_classement: data.URL
  })
};

// Required fields for each model
const requiredFields = {
  Chercheur: ['chercheur_id', 'nom_complet'],
  Publication: ['publication_id', 'chercheur_id', 'titre_publication'],
  ConfJournal: ['publication_id', 'nom'],
  Classement: ['class_id'],
  PubClassement: ['publication_id', 'class_id']
};

// Main import function
async function importAllData() {
  try {
    // Start transaction
    const transaction = await sequelize.transaction();
    
    console.log('Starting data import...');
    
    try {
      // Import in correct order respecting foreign keys
      await importCSV('./data/Chercheurs.csv', Chercheur, transformers.Chercheur, {
        requiredFields: requiredFields.Chercheur,
        transaction
      });

      await importCSV('./data/Publications.csv', Publication, transformers.Publication, {
        requiredFields: requiredFields.Publication,
        transaction
      });
      
      
      await importCSV('./data/ConfJournals.csv', ConfJournal, transformers.ConfJournal, {
        requiredFields: requiredFields.ConfJournal,
        transaction
      });

      await importCSV('./data/Classements.csv', Classement, transformers.Classement, {
        requiredFields: requiredFields.Classement,
        transaction
      });

      await importCSV('./data/PubClassements.csv', PubClassement, transformers.PubClassement, {
        requiredFields: requiredFields.PubClassement,
        transaction
      });
      
      // Commit transaction if all succeeds
      await transaction.commit();
      console.log('All data imported successfully!');
    } catch (importError) {
      // Rollback transaction on error
      await transaction.rollback();
      throw importError;
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importAllData();
