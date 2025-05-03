  /*const { Chercheur } = require('../models');

exports.createchercheur = async (req, res) => {
  try {
    const {
      chercheur_id,
      nom_complet,
      mails,
      tél,
      diplôme,
      etablissement_origine,
      qualité, 
      grade_recherche,
      statut,
      hindex,
      equipe,
      url,
      photo
    } = req.body;

    // Check if a Chercheur with same email (mails) already exists
    const existingChercheur = await Chercheur.findOne({ where: { Mails: mails } });
    if (existingChercheur) {
      return res.status(400).json({ message: 'Un chercheur avec cet e-mail existe déjà.' });
    }

    // Create new Chercheur
    const chercheur = await Chercheur.create({
      chercheur_id,
      nom_complet,
      Mails: mails,
      Tél: tél,
      Diplôme: diplôme,
      Etablissement_origine: etablissement_origine,
      Qualité: qualité,
      Grade_Recherche: grade_recherche,
      Statut: statut,
      Hindex: hindex,
      Equipe: equipe,
      URL: url,
      photo
    });

    res.status(201).json({ message: 'Chercheur créé avec succès', chercheur });
  } catch (error) {
    console.error('Erreur lors de la création du chercheur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du chercheur.' });
  }
};   */


 const Chercheur = require("../models/chercheur.model");
const { Op } = require("sequelize");
const Joi = require("joi");

/// ✅ Schéma de validation corrigé pour correspondre au modèle Chercheur
const chercheurSchema = Joi.object({
  chercheur_id: Joi.string().required().messages({
    'any.required': "L'identifiant est requis",   
    'string.empty': "L'identifiant ne peut pas être vide"
  }),
  nom_complet: Joi.string().required().messages({
    'any.required': 'Le nom complet est requis',
    'string.empty': 'Le nom complet ne peut pas être vide'
  }),
  Mails: Joi.string().email().required().messages({
    'any.required': "L'adresse email est requise",
    'string.email': "L'adresse email n'est pas valide",
    'string.empty': "L'adresse email ne peut pas être vide"
  }),
  Tél: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required().messages({
    'any.required': 'Le numéro de téléphone est requis',
    'string.pattern.base': 'Le numéro de téléphone n\'est pas valide',
  }),
  
  Diplôme: Joi.string().allow('', null),
  Etablissement_origine: Joi.string().allow('', null),
  Qualité: Joi.string().allow('', null),
  Grade_Recherche: Joi.string().allow('', null),
  Statut: Joi.string().valid("Actif", "Inactif").allow(null),
  is_deleted: Joi.boolean().optional(),
  Hindex: Joi.number().integer().min(0).allow(null),
  Equipe: Joi.string().allow('', null),
  Lien_DBLP: Joi.string().uri().allow('', null),
  Lien_GoogleScholar: Joi.string().uri().allow('', null),
  Orcid: Joi.string().allow('', null),
  Grade_Enseignement: Joi.string().allow('', null), // Corrigé l'orthographe
  Chef_Equipe: Joi.boolean().optional(),
 // photo: Joi.string().allow('', null) // Ajouté pour correspondre au modèle
});

// ✅ Middleware de validation
const validateChercheur = (req, res, next) => {
  const { error } = chercheurSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// ✅ Obtenir tous les chercheurs 
const getChercheurs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await Chercheur.findAndCountAll({
      limit,
      offset,
      where: { Statut: "Actif" } // Ajouté pour ne récupérer que les chercheurs actifs
    });

    res.json({
      total: result.count,
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Obtenir un chercheur par son ID
const getChercheurById = async (req, res) => {
  try {
    const { id } = req.params;
    const chercheur = await Chercheur.findByPk(id);

    if (!chercheur || chercheur.Statut === "Inactif") {
      return res.status(404).json({ message: "Chercheur non trouvé" });
    }

    res.json(chercheur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Ajouter un chercheur
const createchercheur = async (req, res) => { 
  try {
    const { error } = chercheurSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { Mails, chercheur_id } = req.body;

    // Vérification si un chercheur avec cet email existe déjà
    const existingChercheur = await Chercheur.findOne({ where: { Mails } });
    if (existingChercheur) {
      return res.status(400).json({ message: 'Un chercheur avec cet e-mail existe déjà.' });
    }
    
    // Vérification si un chercheur avec cet ID existe déjà
    const existingId = await Chercheur.findByPk(chercheur_id);
    if (existingId) {
      return res.status(400).json({ message: 'Un chercheur avec cet identifiant existe déjà.' });
    }
    
    const chercheur = await Chercheur.create(req.body);
    res.status(201).json(chercheur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Rechercher avec filtres avancés
const searchChercheurs = async (req, res) => {
  try {
    const {
      nom_complet, Diplôme, Etablissement_origine, Qualité,
      Grade_Recherche, Statut, Equipe, Hindex_min,
      Hindex_max, Hindex_exact, limit: limitParam, offset: offsetParam
    } = req.query;
    console.log("🔎 Appel à /search avec URL :", req.url);

    const limit = parseInt(limitParam) || 10;
    const offset = parseInt(offsetParam) || 0;

    const whereClause = { Statut: Statut || "Actif" }; // Par défaut, on cherche les actifs

    if (nom_complet) whereClause.nom_complet = { [Op.like]: `%${nom_complet}%` };
    if (Diplôme) whereClause.Diplôme = Diplôme;
    if (Etablissement_origine) whereClause.Etablissement_origine = Etablissement_origine;
    if (Qualité) whereClause.Qualité = Qualité;
    if (Grade_Recherche) whereClause.Grade_Recherche = Grade_Recherche;
    if (Equipe) whereClause.Equipe = Equipe;

    if (Hindex_exact) {
      whereClause.Hindex = Number(Hindex_exact);
    } else {
      if (Hindex_min && Hindex_max) {
        whereClause.Hindex = { [Op.between]: [Number(Hindex_min), Number(Hindex_max)] };
      } else if (Hindex_min) {
        whereClause.Hindex = { [Op.gte]: Number(Hindex_min) };
      } else if (Hindex_max) {
        whereClause.Hindex = { [Op.lte]: Number(Hindex_max) };
      }
    }

    const result = await Chercheur.findAndCountAll({
      where: whereClause,
      limit,
      offset
    });

    res.json({
      total: result.count,
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors du filtrage des chercheurs" });
  }
};

// ✅ Mettre à jour un chercheur
const updateChercheur = async (req, res) => {
  try {
    const { id } = req.params;
    const nouvellesDonnees = req.body;

    // On supprime la validation complète car on peut recevoir des mises à jour partielles
    // et valider seulement les champs fournis
    const chercheur = await Chercheur.findByPk(id);
    if (!chercheur || chercheur.Statut === "Inactif") {
      return res.status(404).json({ message: "Chercheur non trouvé" });
    }

    // Si l'email est modifié, vérifier s'il existe déjà
    if (nouvellesDonnees.Mails && nouvellesDonnees.Mails !== chercheur.Mails) {
      const existingEmail = await Chercheur.findOne({ 
        where: { 
          Mails: nouvellesDonnees.Mails,
          chercheur_id: { [Op.ne]: id } // Exclure le chercheur actuel
        }
      });
      
      if (existingEmail) {
        return res.status(400).json({ message: 'Un chercheur avec cet e-mail existe déjà.' });
      }
    }

    await chercheur.update(nouvellesDonnees);
    res.json({ message: "Profil mis à jour avec succès", chercheur });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
};

// ✅ Supprimer un chercheur (changer le statut à inactif)
const deleteChercheur = async (req, res) => {
  const id = req.params.id;
  try {
    const chercheur = await Chercheur.findByPk(id);
    if (!chercheur) {
      return res.status(404).json({ message: "Chercheur non trouvé" });
    }

    // Mettre à jour le statut du chercheur à "Inactif"
    await chercheur.update({ Statut: "Inactif" });
    res.json({ message: "Chercheur marqué comme inactif avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

// ✅ Export
module.exports = {
  getChercheurs,
  getChercheurById,
  createchercheur,
  searchChercheurs,
  updateChercheur,
  deleteChercheur,
  validateChercheur
};
