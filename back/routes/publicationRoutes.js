const express = require("express");
const router = express.Router();

// Import du contrôleur
const {
  filtrerPublications,
  getPublicationsByChercheur,
  getPublicationDetails,
  createPublication,
  updatePublication,
  deletePublication,
  validatePublication
} = require("../controllers/publicationController"); 

// Route pour filtrer les publications
router.get("/filtrer", filtrerPublications); 

// Récupérer les publications d'un chercheur
router.get("/chercheur/:id", getPublicationsByChercheur);

// Récupérer les détails d'une publication spécifique
 router.get("/:publication_id/:chercheur_id", getPublicationDetails);

// Créer une nouvelle publication
router.post("/", validatePublication, createPublication);

// Mettre à jour une publication
router.put("/:publication_id/:chercheur_id", validatePublication, updatePublication); 

// Supprimer une publication
router.delete("/:publication_id/:chercheur_id", deletePublication);

module.exports = router;
