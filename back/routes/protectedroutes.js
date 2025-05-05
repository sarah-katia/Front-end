const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // adapte le chemin selon ton projet

router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé', user: req.user });

});


//router.post('/admin-update-password', authMiddleware, userController.adminUpdatePassword);

module.exports = router;