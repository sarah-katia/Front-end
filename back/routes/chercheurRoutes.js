const express = require('express');
const router = express.Router();
const chercheurController = require("../controllers/chercheurController");

// Search for researchers with criteria
router.get('/search', chercheurController.searchChercheurs);

// // Get a researcher by ID with related data
// router.get('/:id', chercheurController.getChercheurById);

// // Advanced search with pagination
// router.get('/advanced-search', chercheurController.advancedSearch);

module.exports = router;