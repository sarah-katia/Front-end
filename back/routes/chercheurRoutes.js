const express = require('express');
const router = express.Router();
const chercheurController = require("../controllers/chercheurController");

// Search for researchers with criteria
router.get('/search', chercheurController.searchChercheurs);

// // Get a researcher by ID with related data
// router.get('/:id', chercheurController.getChercheurById);

// // Advanced search with pagination
// router.get('/advanced-search', chercheurController.advancedSearch);


// ✅ Route pour la recherche avec filtres

router.get("/search", searchChercheurs);

// ✅ Route pour obtenir le chercheur par son id 
router.get('/:id', getChercheurById); 




// ✅ Route pour créer un chercheur
router.post("/",authMiddleware, validateChercheur, createchercheur);

// ✅ Route pour mettre à jour un chercheur
router.put("/:id", authMiddleware,validateChercheur, updateChercheur);

// ✅ Route pour supprimer un chercheur
router.delete("/:id", authMiddleware, deleteChercheur);


module.exports = router;