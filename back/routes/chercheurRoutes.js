const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware.js');
// Import du contrôleur
const {
    getChercheurs,
    getChercheurById,
    createchercheur,
    searchChercheurs,
    updateChercheur,
    deleteChercheur,
    validateChercheur
  
  } = require("../controllers/chercheurcontroller.js");  


 
// ✅ Route pour obtenir tous les chercheurs
router.get("/", getChercheurs);  


// ✅ Route pour la recherche avec filtres

router.get("/search", searchChercheurs);

// ✅ Route pour obtenir le chercheur par son id 
router.get('/:id', getChercheurById); 




// ✅ Route pour créer un chercheur
router.post("/", validateChercheur, createchercheur);

// ✅ Route pour mettre à jour un chercheur
router.put("/:id", validateChercheur, updateChercheur);

// ✅ Route pour supprimer un chercheur
router.delete("/:id", deleteChercheur);

module.exports = router;
