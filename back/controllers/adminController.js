require('dotenv').config();
const PendingUser = require("../models/pendinguser");
const Utilisateur = require("../models/utilisateur.model");
const Chercheur = require("../models/chercheur.model");
const Publication = require("../models/publication.model");
const ConfJournal = require("../models/conf_journal.model");
const PubClassement = require("../models/pub_classement.model");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { exec } = require('child_process');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// Job queue to track background processing
const jobQueue = new Map();

/**
 * Helper Functions
 */

// Extract year from date string
function extractYear(dateString) {
  if (!dateString) return null;
  
  // Try to extract a 4-digit year using regex
  const yearMatch = dateString.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) return parseInt(yearMatch[0]);
  
  // If no match found, try parsing as a date object
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.getFullYear();
    }
  } catch (e) {
    // Parsing failed
  }
  
  return null;
}

// Clean up temporary files
function cleanupFiles(filePaths) {
  filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted temporary file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }
  });
}

// Send credentials email
async function sendCredentialsEmail(email, password, role) {
  try {

    console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASS ? 'loaded' : 'missing');

    // Configure transporter (use your actual email service configuration)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Has Been Approved',
      html: `
        <h1>Welcome to the Research Platform</h1>
        <p>Your account has been approved as a ${role}.</p>
        <p>Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please login at <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
        <p>For security reasons, we recommend that you change your password after the first login.</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Credentials email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error sending credentials email: ${error.message}`);
    return false;
  }
}

// Send rejection email
async function sendRejectionEmail(email) {
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registration Request Status',
      html: `
        <h1>Registration Request Update</h1>
        <p>We regret to inform you that your registration request has been declined.</p>
        <p>If you believe this was an error or would like to provide additional information, please contact the administrator.</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error sending rejection email: ${error.message}`);
    return false;
  }
}

// Process researcher data in background
async function processResearcherInBackground(jobId, nom_complet, chercheur_id) {
  try {
    // Update job status
    const job = jobQueue.get(jobId);
    if (!job) {
      console.error(`Job ${jobId} not found in job queue`);
      return;
    }
    
    job.status = 'processing';
    
    // Prepare paths for the Python script and output CSVs
    const scriptPath = path.join(__dirname, '../scripts/researcher_scraper.py');
    const outputPath = path.join(__dirname, '../scripts', `${chercheur_id}_publications.csv`);
    const outputConfJournalPath = path.join(__dirname, '../scripts', `${chercheur_id}_ConfJournal.csv`);
    const outputTabClassmentPath = path.join(__dirname, '../scripts', `${chercheur_id}_tabClassment.csv`);

    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      job.status = 'failed';
      job.error = `Script not found at path: ${scriptPath}`;
      job.completed = true;
      return;
    }

    // Execute the Python script
    console.log(`Processing researcher: ${nom_complet}`);
    const pythonCommand = `python ${scriptPath} --name "${nom_complet}" --id ${chercheur_id} --output ${outputPath} --confJournaloutput ${outputConfJournalPath} --Classmentoutput ${outputTabClassmentPath}`;
    
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
            confJournalCount: 0,
            classementCount: 0,
            message: 'No valid publications found'
          };
          job.completed = true;
          return;
        }

        // STEP 2: Process ConfJournal CSV
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

          // Create ConfJournal entries
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
        
        // Create publications
        const createdPublications = [];
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
          
          // Create PubClassement entries
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

/**
 * Controller Functions
 */

// Get all pending requests
exports.getAllPendingRequests = async (req, res) => {
  try {
    const pendingUsers = await PendingUser.findAll({
      where: { status: "Pending" }
    });
    
    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    console.error(`Error fetching pending requests: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching pending requests",
      error: error.message
    });
  }
};

// Approve a pending user
exports.approveUser = async (req, res) => {
  try {
    const { pendingId } = req.params;
    
    // Find the pending user
    const pendingUser = await PendingUser.findByPk(pendingId);
    
    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Pending user not found"
      });
    }
    
    // Check if status is already approved or rejected
    if (pendingUser.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This registration request has already been ${pendingUser.status.toLowerCase()}`
      });
    }
    
    // Update status to approved
    await pendingUser.update({ status: "Approved" });
    
    // Generate a random password
    const plainPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    // Create record in Utilisateur table
    const utilisateurData = {
      nom_complet: pendingUser.nom_complet,
      Mails: pendingUser.Mails,
      password: hashedPassword,
      Tél: pendingUser.Tél,
      Rôle: pendingUser.Rôle,
      photo: pendingUser.photo || "https://res.cloudinary.com/dv5ylazxm/image/upload/v1746196561/Unknown_person_gffmfs.jpg"
    };
    
    const newUser = await Utilisateur.create(utilisateurData);
    
    // Send email with credentials
    await sendCredentialsEmail(pendingUser.Mails, plainPassword, pendingUser.Rôle);
    
    // If the user is a researcher, create record in Chercheur table and start scraping process
    if (pendingUser.Rôle === "Chercheur") {
      const chercheurId = uuidv4();
      
      // Create record in Chercheur table
      const chercheurData = {
        chercheur_id: chercheurId,
        nom_complet: pendingUser.nom_complet,
        Mails: pendingUser.Mails,
        Tél: pendingUser.Tél,
        Diplôme: pendingUser.Diplôme,
        Etablissement_origine: pendingUser.Etablissement_origine,
        Qualité: pendingUser.Qualité,
        Equipe: pendingUser.Equipe,
        Orcid: pendingUser.Orcid,
        Grade_Enseignemet: pendingUser.Grade_Enseignemet,
        Lien_DBLP: pendingUser.Lien_DBLP,
        Lien_GoogleScholar: pendingUser.Lien_GoogleScholar,
        photo: pendingUser.photo || "https://res.cloudinary.com/dv5ylazxm/image/upload/v1746196561/Unknown_person_gffmfs.jpg",
        Statut: "Actif",
        Hindex: pendingUser.Hindex
      };
      
      const newChercheur = await Chercheur.create(chercheurData);
      
      // Update the user record with chercheur_id
      await newUser.update({ chercheur_id: chercheurId });
      
      // Generate a job ID
      const jobId = `researcher_${chercheurId}_${Date.now()}`;
      
      // Add job to queue with status "pending"
      jobQueue.set(jobId, {
        type: 'add_researcher',
        status: 'pending',
        started: new Date(),
        researcher: {
          id: chercheurId,
          name: pendingUser.nom_complet
        },
        completed: false,
        results: null
      });
      
      // Start scraping process in background
      processResearcherInBackground(jobId, pendingUser.nom_complet, chercheurId);
      
      // Return response with researcher info and job ID
      return res.status(200).json({
        success: true,
        message: `User approved and added as ${pendingUser.Rôle}. Publication scraping started in background.`,
        data: {
          user: newUser,
          researcher: newChercheur,
          jobId: jobId,
          statusEndpoint: `/admin/jobs/${jobId}`
        }
      });
    }
    
    // Return response for non-researcher users
    res.status(200).json({
      success: true,
      message: `User approved and added as ${pendingUser.Rôle}`,
      data: {
        user: newUser
      }
    });
    
  } catch (error) {
    console.error(`Error approving user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error approving user",
      error: error.message
    });
  }
};

// Reject a pending user
exports.rejectUser = async (req, res) => {
  try {
    const { pendingId } = req.params;
    
    // Find the pending user
    const pendingUser = await PendingUser.findByPk(pendingId);
    
    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Pending user not found"
      });
    }
    
    // Check if status is already approved or rejected
    if (pendingUser.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `This registration request has already been ${pendingUser.status.toLowerCase()}`
      });
    }
    
    // Update status to rejected
    await pendingUser.update({ status: "Rejected" });
    
    // Notify user about rejection
    await sendRejectionEmail(pendingUser.Mails);
    
    res.status(200).json({
      success: true,
      message: "User registration rejected",
      data: pendingUser
    });
    
  } catch (error) {
    console.error(`Error rejecting user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error rejecting user",
      error: error.message
    });
  }
};

// Get job status
exports.getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if job exists
    if (!jobQueue.has(jobId)) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    // Get job info
    const job = jobQueue.get(jobId);
    
    // Return job status
    res.status(200).json({
      success: true,
      data: {
        jobId,
        type: job.type,
        status: job.status,
        started: job.started,
        completed: job.completed,
        results: job.results,
        error: job.error,
        researcher: job.researcher
      }
    });
    
  } catch (error) {
    console.error(`Error getting job status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error getting job status",
      error: error.message
    });
  }
};

// Get all jobs (admin only)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = Array.from(jobQueue.entries()).map(([jobId, job]) => ({
      jobId,
      type: job.type,
      status: job.status,
      started: job.started,
      completed: job.completed,
      researcher: job.researcher
    }));
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
    
  } catch (error) {
    console.error(`Error getting all jobs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error getting all jobs",
      error: error.message
    });
  }
};

// ✅ Email format validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Create User — 🔒 Admin only
exports.createUser = async (req, res) => {
  try {
    // 🔐 Check if requester is Admin
    if (req.user?.Rôle !== 'Administrateur') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les administrateurs peuvent créer des utilisateurs.'
      });
    }

    let { Mails, Rôle, Tél, chercheur_id } = req.body;

    if (!Mails || !Rôle) {
      console.warn('[CREATE USER] Champs requis manquants');
      return res.status(400).json({
        status: 'error',
        message: 'Mails et Rôle sont requis.',
        error: 'Champs manquants'
      });
    }

    if (!isValidEmail(Mails)) {
      console.warn('[CREATE USER] Email invalide:', Mails);
      return res.status(400).json({
        status: 'error',
        message: "Format d'email invalide.",
        error: 'Email regex failed'
      });
    }

    if (Rôle === 'Chercheur' && !chercheur_id) {
      console.warn('[CREATE USER] chercheur_id manquant pour Chercheur');
      return res.status(400).json({
        status: 'error',
        message: 'chercheur_id requis pour un chercheur.',
        error: 'Rôle Chercheur sans ID'
      });
    }

    if (Rôle !== 'Chercheur') {
      chercheur_id = null;
    }

    if (Rôle === 'Chercheur' && chercheur_id) {
      const chercheur = await Chercheur.findByPk(chercheur_id);
      if (!chercheur) {
        return res.status(400).json({
          status: 'error',
          message: "Le chercheur_id fourni n'existe pas.",
          error: 'Chercheur introuvable'
        });
      }
      if (chercheur.Mails !== Mails) {
        return res.status(400).json({
          status: 'error',
          message: "L'email ne correspond pas au chercheur enregistré.",
          error: 'Mismatch Mails / chercheur_id'
        });
      }
    }

    const existingUser = await Utilisateur.findOne({ where: { Mails } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Un compte avec cet e-mail existe déjà.',
        error: 'Utilisateur existant'
      });
    }

    const plainPassword = Math.random().toString(36).slice(-10);
    console.log(`[CREATE USER] Mot de passe pour ${Mails} : ${plainPassword}`);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const count = await Utilisateur.count();
    const utilisateurId = count + 1;

    const utilisateur = await Utilisateur.create({
      utilisateur_id: utilisateurId,
      Mails,
      password: hashedPassword,
      Tél,
      chercheur_id: chercheur_id || null,
      Rôle
    });

    try {
      await transporter.sendMail({
        from: '"ESI Auth System" <lmcslabo@gmail.com>',
        to: Mails,
        subject: 'Votre compte a été créé',
        html: `<p>Bonjour,<br><br>Votre mot de passe est : <b>${plainPassword}</b><br><br>Merci.</p>`
      });
    } catch (err) {
      console.error('[EMAIL] Échec envoi email:', err);
    }

    return res.status(201).json({
      status: 'success',
      message: 'Compte créé et email envoyé.',
      data: { utilisateur_id: utilisateur.utilisateur_id }
    });

  } catch (error) {
    console.error('[CREATE USER] Erreur serveur:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la création du compte.',
      error: error.message
    });
  }
};



// ✅ Admin-only password override
exports.adminUpdatePassword = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.user?.Rôle !== 'Administrateur') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les administrateurs peuvent modifier les mots de passe.'
      });
    }

    const { Mails, newPassword } = req.body;

    if (!Mails || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Mails et nouveau mot de passe requis.'
      });
    }

    const utilisateur = await Utilisateur.findOne({ where: { Mails } });
    if (!utilisateur) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur introuvable.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    utilisateur.password = hashedPassword;
    await utilisateur.save();

    return res.status(200).json({
      status: 'success',
      message: 'Mot de passe mis à jour par l’administrateur.'
    });

  } catch (error) {
    console.error('[ADMIN UPDATE PASSWORD] Erreur:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur.',
      error: error.message
    });
  }
};