const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

// Dashboard statistics routes (no auth middleware)
router.get('/stats', DashboardController.getStats);
router.get('/publications-by-team', DashboardController.getPublicationsByTeam);
router.get('/chercheurs-by-team', DashboardController.getChercheursByTeam);
router.get('/yearly-stats', DashboardController.getYearlyStats);
router.get('/top-chercheurs', DashboardController.getTopChercheurs);
router.get('/pourcentage-publications', DashboardController.getPourcentagePublications);
router.get('/scimago-publications', DashboardController.getScimagoPublications);
router.get('/core-publications', DashboardController.getCorePublications);
router.get('/stats-by-date-range', DashboardController.getStatsByDateRange);
router.get('/export-by-team', DashboardController.exportPublicationsByTeam);

module.exports = router;