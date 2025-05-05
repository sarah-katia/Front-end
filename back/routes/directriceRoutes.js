const express = require('express');
const router = express.Router();
const pageController = require('../controllers/directriceController');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.post('/register', pageController.uploadChercheurPhoto,pageController.submitRequest);

// Ajouter un chercheur
router.post('/', pageController.uploadChercheurPhoto, pageController.addResearcherWithPublications);
router.post('/MAJ', pageController.updatePublications);
router.get('/jobs/:jobId', pageController.getJobStatus);
router.get("/assistants",  pageController.getAssistants ) ;
router.post("/assistants",authMiddleware,  pageController.createAssistant ) ; 


module.exports = router;
