const Chercheur = require('../models/chercheur.model');
const Publication = require('../models/publication.model');
const ConfJournal = require('../models/conf_journal.model');
const Classement = require('../models/classement.model');
const PubClassement = require('../models/pub_classement.model');
const { Op } = require('sequelize');

/**
 * Search for researchers based on multiple criteria and return them
 * with their publications, conference/journal info, and rankings
 * Adapted for the specified associations structure
 */
exports.searchChercheurs = async (req, res) => {
  try {
    // Extract filter criteria from request
    const {
      searchText,
      hindex,
      hindexMin,
      hindexMax,
      etablissement,
      qualite,
      statut,
      equipe,
      diplome
    } = req.query;

    // Build filter conditions
    const whereConditions = {};

    // Text search (for nom_complet)
    if (searchText) {
      whereConditions.nom_complet = {
        [Op.like]: `%${searchText}%`
      };
    }

    // H-index filters
    if (hindex) {
      whereConditions.Hindex = hindex;
    } else {
      if (hindexMin) {
        whereConditions.Hindex = { ...whereConditions.Hindex, [Op.gte]: hindexMin };
      }
      if (hindexMax) {
        whereConditions.Hindex = { ...whereConditions.Hindex, [Op.lte]: hindexMax };
      }
    }

    // Other filters
    if (etablissement) {
      whereConditions.Etablissement_origine = etablissement;
    }
    if (qualite) {
      whereConditions.Qualité = qualite;
    }
    if (statut) {
      whereConditions.Statut = statut;
    }
    if (equipe) {
      whereConditions.Equipe = equipe;
    }
    if (diplome) {
      whereConditions.Diplôme = diplome;
    }

    // Query for researchers with their publications, conferences, and rankings
    // Based on the specific association structure provided
    const chercheurs = await Chercheur.findAll({
      where: whereConditions,
      include: [
        {
          model: Publication,
          include: [
            {
              model: ConfJournal,
              include: [
                {
                  model: PubClassement,
                  
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['nom_complet', 'ASC']
      ]
    });

    // Check if researchers were found
    if (chercheurs.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Aucun chercheur trouvé correspondant aux critères de recherche." 
      });
    }

    return res.status(200).json({
      success: true,
      count: chercheurs.length,
      data: chercheurs
    });

  } catch (error) {
    console.error("Erreur lors de la recherche des chercheurs:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche des chercheurs",
      error: error.message
    });
  }
};