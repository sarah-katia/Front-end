const { Op } = require("sequelize");
const Chercheur = require("../models/chercheur.model");
const Publication = require("../models/publication.model");
const ConfJournal = require("../models/conf_journal.model");
const Classement = require("../models/classement.model");  
const PubClassement = require("../models/pub_classement.model");  
const Joi = require("joi");  


  
const filtrerPublications = async (req, res) => {
  try {
    const {
      annee_debut,
      annee_fin,
      type_publication,
      periodicite,
      thematique,
      classement_type,
      classement_nom,
      classement_rang,
      page = 1,
      limit = 10
    } = req.query;

    // Conditions sur la table Publication
    const whereConditions = {
      is_deleted: false
    };

    if (annee_debut || annee_fin) {
      whereConditions.annee = {};
      if (annee_debut) whereConditions.annee[Op.gte] = parseInt(annee_debut);
      if (annee_fin) whereConditions.annee[Op.lte] = parseInt(annee_fin);
    }

    // Configuration des includes de base
    const includes = [];

    // Where sur ConfJournal
    const confJournalWhere = {};
    if (type_publication) confJournalWhere.type = type_publication;
    if (periodicite) confJournalWhere.periodicite = periodicite;
    if (thematique) {
      confJournalWhere.thematique = {
        [Op.like]: `%${thematique}%`
      };
    }

    // Préparation de l'include ConfJournal
    const confJournalInclude = {
      model: ConfJournal,
      required: Object.keys(confJournalWhere).length > 0,
      where: Object.keys(confJournalWhere).length > 0 ? confJournalWhere : undefined
    };

    // Traitement des filtres de classement
    if (classement_nom || classement_type || classement_rang) {
      try {
        // Étape 1: Trouver les class_id correspondant aux critères dans la table Classement
        let classementWhere = {};
        if (classement_nom) classementWhere.Nom = classement_nom;
        if (classement_type) classementWhere.Type = classement_type;
        
        let classementIds = [];
        if (Object.keys(classementWhere).length > 0) {
          const matchingClassements = await Classement.findAll({
            attributes: ['class_id'],
            where: classementWhere
          });
          classementIds = matchingClassements.map(c => c.class_id);
          
          if (classementIds.length === 0) {
            // Aucun classement ne correspond aux critères
            return res.json({
              total: 0,
              totalPages: 0,
              currentPage: parseInt(page),
              publications: []
            });
          }
        }
        
        // Étape 2: Trouver les publication_id dans PubClassement
        let pubClassementWhere = {};
        if (classementIds.length > 0) {
          pubClassementWhere.class_id = { [Op.in]: classementIds };
        }
        if (classement_rang) {
          pubClassementWhere.classement = classement_rang;
        }
        
        if (Object.keys(pubClassementWhere).length > 0) {
          const matchingPubs = await PubClassement.findAll({
            attributes: ['publication_id'],
            where: pubClassementWhere
          });
          
          const pubIds = matchingPubs.map(p => p.publication_id);
          if (pubIds.length === 0) {
            // Aucune publication ne correspond aux critères de classement
            return res.json({
              total: 0,
              totalPages: 0,
              currentPage: parseInt(page),
              publications: []
            });
          }
          
          // Ajouter le filtre sur les IDs de publication
          whereConditions.publication_id = { [Op.in]: pubIds };
        }
      } catch (error) {
        console.error("Erreur lors du pré-filtrage par classement:", error);
        // Continuer sans le filtre de classement
      }
    }

    // Ajout de ConfJournal à l'include
    includes.push(confJournalInclude);
    
    // Ajout d'includes pour récupérer les données associées
    // Ces includes sont séparés du processus de filtrage pour éviter les problèmes
    if (classement_nom || classement_type || classement_rang) {
      // Ajouter un include PubClassement à ConfJournal pour récupérer les données
      // sans influencer le filtrage (qui est déjà fait)
      const pubClassementInclude = {
        model: PubClassement,
        required: false,
        include: [{
          model: Classement,
          required: false
        }]
      };
      
      if (!confJournalInclude.include) {
        confJournalInclude.include = [];
      }
      confJournalInclude.include.push(pubClassementInclude);
    }
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Exécution de la requête
    const publications = await Publication.findAndCountAll({
      where: whereConditions,
      include: includes,
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    res.json({
      total: publications.count,
      totalPages: Math.ceil(publications.count / limit),
      currentPage: parseInt(page),
      publications: publications.rows
    });

  } catch (error) {
    console.error("Erreur lors du filtrage des publications:", error);
    res.status(500).json({
      error: "Erreur serveur lors du filtrage des publications",
      details: error.message
    });
  }
};



const re = {
  sub: (pattern, replacement, string) => string.replace(new RegExp(pattern, 'g'), replacement)
};

// Fonction pour générer automatiquement un publication_id
const generate_publication_id = (publication_name, year) => {
  // Remove special characters and spaces, and convert to lowercase
  const cleaned_name = re.sub('[^a-zA-Z0-9]', '', publication_name).toLowerCase();

  // Gestion des cas où le nom nettoyé est trop court
  if (cleaned_name.length < 5) {
    return `${cleaned_name}${year}`;
  }

  const middle_index = Math.floor(cleaned_name.length / 2);
  const shortened_name = (
    cleaned_name.substring(0, 2) +       // first 2 characters
    cleaned_name[middle_index] +         // middle character
    cleaned_name.substring(cleaned_name.length - 2) // last 2 characters
  );

  return `${shortened_name}${year}`;
};


// Schéma de validation pour la publication - publication_id devient optionnel
const publicationSchema = Joi.object({
  publication_id: Joi.string().allow('', null), // Maintenant optionnel
  chercheur_id: Joi.string().required().messages({
    'any.required': "L'identifiant du chercheur est requis",
    'string.empty': "L'identifiant du chercheur ne peut pas être vide"
  }),
  date: Joi.date().required().messages({
    'any.required': "La date de publication est requise",
    'date.base': "La date doit être valide"
  }),
  titre_publication: Joi.string().required().messages({
    'any.required': "Le titre de la publication est requis",
    'string.empty': "Le titre ne peut pas être vide"
  }),
  nombre_pages: Joi.number().integer().min(1).allow(null),
  volumes: Joi.string().allow('', null),
  lien: Joi.string().uri().allow('', null).messages({
    'string.uri': "Le lien doit être une URL valide"
  }),
  editors: Joi.string().allow('', null),
  book: Joi.string().allow('', null),
  publisher: Joi.string().allow('', null),
  auteurs: Joi.string().messages({
    'any.required': "Les auteurs sont requis",
    'string.empty': "La liste des auteurs ne peut pas être vide"
  }),
  annee: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
    'any.required': "L'année de publication est requise",
    'number.base': "L'année doit être un nombre",
    'number.min': "L'année doit être supérieure à 1900",
    'number.max': "L'année ne peut pas être dans le futur lointain"
  }),
  is_deleted: Joi.boolean().default(false)
});

const confJournalSchema = Joi.object({
  publication_id: Joi.string().allow('', null), // plus required
  nom: Joi.string().required().messages({
    'any.required': "Le nom de la conférence/journal est requis"
  }),
  type: Joi.string().valid('Journal', 'Conférence').required().messages({
    'any.required': "Le type (Journal ou Conférence) est requis",
    'any.only': "Le type doit être soit 'Journal' soit 'Conférence'"
  }),
  thematique: Joi.string().allow('', null),
  scope: Joi.string().allow('', null),
  lieu: Joi.string().allow('', null),
  periode: Joi.string().allow('', null),
  periodicite: Joi.string().allow('', null)
});

const pubClassementSchema = Joi.object({
  publication_id: Joi.string().allow('', null), // plus required
  class_id: Joi.number().integer().required(),
  classement: Joi.string().allow('', null),
  lien_vers_classement: Joi.string().uri().allow('', null).messages({
    'string.uri': "L'URL doit être valide"
  })
});


// Middleware de validation pour la publication
const validatePublication = (req, res, next) => {
  const { error } = publicationSchema.validate(req.body.publication);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Créer une nouvelle publication avec les informations associées
const createPublication = async (req, res) => {
  const transaction = await Publication.sequelize.transaction();
  
  try {
    if (req.user?.Rôle !== 'Directeur'||"Assistant" ) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les directeurs les assistants  peuvent ajouter une publication.'
      });
    }
    // Validation des données
    const { error: pubError } = publicationSchema.validate(req.body.publication);
    if (pubError) {
      return res.status(400).json({ message: pubError.details[0].message });
    }
    
    if (req.body.confJournal) {
      const { error: confError } = confJournalSchema.validate(req.body.confJournal);
      if (confError) {
        return res.status(400).json({ message: confError.details[0].message });
      }
    }
    
    // Créer une copie des données de publication pour éviter de modifier l'objet original
    const publicationData = { ...req.body.publication };
    
    // Générer un publication_id s'il n'est pas fourni
    if (!publicationData.publication_id) {
      publicationData.publication_id = generate_publication_id(
        publicationData.titre_publication,
        publicationData.annee
      );
    }
    
    // Vérifier si la publication existe déjà
    const existingPublication = await Publication.findOne({
      where: { 
        publication_id: publicationData.publication_id,
        chercheur_id: publicationData.chercheur_id
      }
    });
    
    if (existingPublication) {
      await transaction.rollback();
      return res.status(409).json({ message: "Cette publication existe déjà pour ce chercheur" });
    }
    
    // Créer la publication
    const newPublication = await Publication.create(publicationData, { transaction });
    
    // Créer l'entrée conférence/journal si fournie
    if (req.body.confJournal) {
      req.body.confJournal.publication_id = newPublication.publication_id;
      await ConfJournal.create(req.body.confJournal, { transaction });
    }
    
    // Ajouter les classements si fournis
    if (req.body.classements && Array.isArray(req.body.classements)) {
      for (const classement of req.body.classements) {
        classement.publication_id = newPublication.publication_id;
        const { error: classError } = pubClassementSchema.validate(classement);
        if (classError) {
          await transaction.rollback();
          return res.status(400).json({ message: classError.details[0].message });
        }
        await PubClassement.create(classement, { transaction });
      }
    }
    
    await transaction.commit();
    
    res.status(201).json({
      message: "Publication ajoutée avec succès",
      publication: newPublication
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error("Erreur lors de l'ajout de la publication:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout de la publication" });
  }
};
const getPublicationsByChercheur = async (req, res) => {
  try {
    const chercheurId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await Publication.findAndCountAll({
      where: {
        chercheur_id: chercheurId,
        is_deleted: false
      },
      include: [
        {
          model: ConfJournal,
          include: [
            {
              model: PubClassement,
              include: [
                { model: Classement }
              ]
            }
          ]
        }
      ],
      limit,
      offset
    });
    
    res.json({
      total: result.count,
      data: result.rows
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des publications :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des publications" });
  }
};

// Mettre à jour une publication
const updatePublication = async (req, res) => {
  const transaction = await Publication.sequelize.transaction();
  
  try {  
    if (req.user?.Rôle !== 'Directeur'||"Assistant" ) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les directeurs et les assistants  peuvent modifier des publications.'
      });
    }
    const { publication_id, chercheur_id } = req.params;
    
    // Validation des données
    const { error: pubError } = publicationSchema.validate(req.body.publication);
    if (pubError) {
      return res.status(400).json({ message: pubError.details[0].message });
    }
    
    // Vérifier si la publication existe
    const publication = await Publication.findOne({
      where: {
        publication_id,
        chercheur_id,
        is_deleted: false
      }
    });
    
    if (!publication) {
      await transaction.rollback();
      return res.status(404).json({ message: "Publication non trouvée" });
    }
    
    // Mettre à jour la publication
    await publication.update(req.body.publication, { transaction });
    
    // Mettre à jour la conférence/journal si fournie
    if (req.body.confJournal) {
      const { error: confError } = confJournalSchema.validate(req.body.confJournal);
      if (confError) {
        await transaction.rollback();
        return res.status(400).json({ message: confError.details[0].message });
      }
      
      const confJournal = await ConfJournal.findOne({ where: { publication_id } });
      if (confJournal) {
        await confJournal.update(req.body.confJournal, { transaction });
      } else {
        req.body.confJournal.publication_id = publication_id;
        await ConfJournal.create(req.body.confJournal, { transaction });
      }
    }
    
    // Mettre à jour les classements si fournis
    if (req.body.classements && Array.isArray(req.body.classements)) {
      // Supprimer les anciens classements
      await PubClassement.destroy({ where: { publication_id }, transaction });
      
      // Ajouter les nouveaux classements
      for (const classement of req.body.classements) {
        classement.publication_id = publication_id;
        const { error: classError } = pubClassementSchema.validate(classement);
        if (classError) {
          await transaction.rollback();
          return res.status(400).json({ message: classError.details[0].message });
        }
        await PubClassement.create(classement, { transaction });
      }
    }
    
    await transaction.commit();
    
    res.json({
      message: "Publication mise à jour avec succès",
      publication: await Publication.findOne({ where: { publication_id, chercheur_id } })
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error("Erreur lors de la mise à jour de la publication:", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour de la publication" });
  }
};

// Supprimer une publication (soft delete)
const deletePublication = async (req, res) => {
  try {
    if (req.user?.Rôle !== 'Directeur'||"Assistant") {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les directeurs et les assistants  peuvent supprimer des publications.'
      });
    }
    const { publication_id, chercheur_id } = req.params;
    
    const publication = await Publication.findOne({
      where: {
        publication_id,
        chercheur_id,
        is_deleted: false
      }
    });
    
    if (!publication) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }
    
    // Soft delete
    await publication.update({ is_deleted: true });
    
    res.json({ message: "Publication supprimée avec succès" });
    
  } catch (error) {
    console.error("Erreur lors de la suppression de la publication:", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression de la publication" });
  }
};


const getAllPublications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows: publications } = await Publication.findAndCountAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: ConfJournal,
          include: [
            {
              model: PubClassement,
              attributes: ['classement', 'lien_vers_classement'],
              include: [
                {
                  model: Classement,
                  attributes: ['Nom', 'Type']
                }
              ]
            }
          ]
        }
      ],
      limit,
      offset
    });

    res.json({ total: count, page, publications });

  } catch (error) {
    console.error("Erreur lors de la récupération des publications :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des publications" });
  }
};


const getPublicationDetails = async (req, res) => {
  try {
    const { publication_id, chercheur_id } = req.params;

    const publication = await Publication.findOne({
      where: {
        publication_id,
        chercheur_id,
        is_deleted: false
      },
      include: [
        {
          model: ConfJournal,
          include: [
            {
              model: PubClassement,
              attributes: ['classement', 'lien_vers_classement'],
              include: [
                {
                  model: Classement,
                  attributes: ['Nom', 'Type'] // ici tu peux aussi ajouter 'Type' si besoin
                }
              ]
            }
          ]
        }
      ]
    });

    if (!publication) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    res.json(publication);

  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la publication:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des détails de la publication" });
  }
};

 

module.exports = {
  filtrerPublications,
  getPublicationsByChercheur,
  getPublicationDetails,
  createPublication,
  updatePublication,
  deletePublication,
  validatePublication ,
  getAllPublications
};