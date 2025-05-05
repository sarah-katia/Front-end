const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');




router.post('/login', authController.login);
router.post('/requestreset', authController.requestPasswordReset);
router.post('/confirmreset', authController.confirmPasswordReset);
router.put('/updatepassword', authMiddleware, authController.updatePasswordLoggedIn);





// Route protégée
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Utilisateur authentifié avec succès !',
    user: req.user
  });
});

module.exports = router;