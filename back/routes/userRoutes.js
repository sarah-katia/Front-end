// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/userController');
const  authMiddleware = require('../middlewares/authMiddleware');

// 👤 Route accessible à tout utilisateur connecté pour consulter son profil
router.get('/me', authMiddleware, getUserInfo);

// 🔐 Route réservée à l’admin pour consulter un utilisateur spécifique
router.get('/admin/users/:id', authMiddleware, getUserInfo);
router.get('/directeur/users/:id', authMiddleware, getUserInfo);


module.exports = router;