// controllers/homeController.js

const { Chercheur, Publication } = require('../models');
const { Op, Sequelize } = require('sequelize');
const sendEmail = require('../utiles/mailer');
const unknown = "https://res.cloudinary.com/dv5ylazxm/image/upload/v1746196561/Unknown_person_gffmfs.jpg"




exports.sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendEmail({
      from: 'website-contact@lmcs.esi.dz',
      to: 'admin@lmcs.esi.dz',
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

exports.getHomePageData = async (req, res) => {
  try {
    // Récupérer les statistiques
    const totalPublications = await Publication.count();
    const totalChercheurs = await Chercheur.count();
    
    // Nombre d'équipes de recherche
    const equipes = await Chercheur.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('equipe')), 'equipe']
      ],
      where: {
        equipe: {
          [Op.not]: null
        }
      }
    });
    const totalEquipes = equipes.length;
    
    // Nombre de doctorants
    const totalDoctorants = await Chercheur.count({
      where: {
        Diplôme: 'Doctorat'
      }
    });
    
    const publicationsParAnnee = await Publication.findAll({
      attributes: [
        ['annee', 'annee'],
        [Sequelize.fn('COUNT', Sequelize.col('publication_id')), 'count']
      ],
      group: ['annee'],
      order: [['annee', 'ASC']],
      raw: true
    });
    
    // Récupérer quelques chercheurs arbitraires pour "Notre équipe"
    const teamMembers = await Chercheur.findAll({
      limit: 6,
      order: Sequelize.literal('RAND()'),
      attributes: ['chercheur_id', 'nom_complet', 'Qualité', 'Equipe', 'Grade_Recherche', 'photo']
    });

    // Return all the data as JSON
    res.json({
      stats: {
        totalPublications,
        totalChercheurs,
        totalEquipes,
        totalDoctorants,
        publicationsParAnnee
      },
      teamMembers: teamMembers.map(member => ({
        id: member.chercheur_id,
        name: `${member.nom_complet}`,
        role: member.Qualité || (member.Grade_Recherche === 'doctorant' ? 'membre de l\'équipe' : 'Chef d\'équipe'),
        description: `Membre de l'équipe ${member.Equipe || 'LMCS'}`,
        occupation: member.Grade_Recherche,
        image: member.photo || unknown 
      }))
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors du chargement des données.' });
  }
};