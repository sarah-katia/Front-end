const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Utilisateur, Chercheur } = require('../models');
const nodemailer = require('nodemailer');
const transporter = require('../utiles/mailer.js');



// ✅ Email format validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);




// ✅ Login (unchanged)
exports.login = async (req, res) => {
  try {
    const { Mails, password } = req.body;

    if (!Mails || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Mails et mot de passe requis.',
        error: 'Champs manquants'
      });
    }

    const utilisateur = await Utilisateur.findOne({
      where: { Mails },
      include: [{ model: Chercheur, as: 'Chercheur', required: false }]
    });

    if (!utilisateur) {
      return res.status(404).json({
        status: 'error',
        message: 'Email introuvable.',
        error: 'Utilisateur non trouvé'
      });
    }

    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Mot de passe incorrect.',
        error: 'Comparaison échouée'
      });
    }

    const token = jwt.sign(
      {
        utilisateur_id: utilisateur.utilisateur_id,
        Mails: utilisateur.Mails,
        Rôle: utilisateur.Rôle
      },
      process.env.SECRET_KEY,
      { expiresIn: '10d' }
    );
    console.log(`[LOGIN] Rôle de l'utilisateur: ${utilisateur.Rôle}`);

    return res.status(200).json({
      status: 'success',
      message: 'Connexion réussie.',
      data: {
        token,
        utilisateur: {
          utilisateur_id: utilisateur.utilisateur_id,
          Mails: utilisateur.Mails,
          Rôle: utilisateur.Rôle,
          Tél: utilisateur.Tél,
          chercheur: utilisateur.Chercheur || null
        }
      }
    });

  } catch (error) {
    console.error('[LOGIN] Erreur serveur:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur pendant la connexion.',
      error: error.message
    });
  }

  
};

exports.requestPasswordReset = async (req, res) => {
    try {
        console.log('[RESET] Demande de réinitialisation reçue');
    
        const { email } = req.body;
        if (!email) {
          console.warn('[RESET] Email non fourni');
          return res.status(400).json({ message: 'Email requis.' });
        }
    
        const utilisateur = await Utilisateur.findOne({ where: { Mails : email } });
        if (!utilisateur) {
          console.warn(`[RESET] Aucun utilisateur trouvé pour l’email : ${email}`);
          return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
    
        // Générer token JWT pour réinitialisation
        const token = jwt.sign(
          { utilisateur_id: utilisateur.utilisateur_id },
          process.env.RESET_PASSWORD_SECRET, // Clé secrète pour signer le token
          { expiresIn: '10m' } // Expiration du token dans 10 minutes
        );
    
        const resetLink = `https://ton-frontend.com/reset-password?token=${token}`;
    
        // Envoi du lien de réinitialisation dans l'email
        await transporter.sendMail({
          from: '"ESI Auth System" <lmcslabo@gmail.com>',
          to: email,
          subject: 'Réinitialisation de votre mot de passe',
          html: `<p>Bonjour,<br><br>Voici votre lien de réinitialisation de mot de passe : <a href="${resetLink}">${resetLink}</a><br><br>Le lien expire dans 10 minutes.</p>`
        });
    
        console.log(`[RESET] Lien de réinitialisation envoyé à ${email}`);
        return res.status(200).json({ message: 'Lien de réinitialisation envoyé par email.' });
    
      } catch (error) {
        console.error('[RESET] Erreur serveur :', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la demande de réinitialisation.' });
      }
};

// ✅ Confirm Password Reset (unchanged)
exports.confirmPasswordReset = async (req, res) => {
    try {
        console.log('[CONFIRM] Confirmation de réinitialisation en cours');
    
        const { token, newPassword } = req.body;
    
        if (!token || !newPassword) {
          console.warn('[CONFIRM] Données manquantes');
          return res.status(400).json({ message: 'Token et nouveau mot de passe requis.' });
        }
    
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    
        // Récupérer l'ID utilisateur du token
        const utilisateur = await Utilisateur.findByPk(decoded.utilisateur_id);
    
        if (!utilisateur) {
          return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
    
        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Mettre à jour le mot de passe
        utilisateur.password = hashedPassword;
        await utilisateur.save();
    
        return res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    
      } catch (error) {
        console.error('[CONFIRM] Erreur lors de la vérification du token :', error);
        return res.status(400).json({ message: 'Token invalide ou expiré.' });
      }
};


// ✅ Update Password (logged-in users — NOT Admin)
exports.updatePasswordLoggedIn = async (req, res) => {
  try {
    const { utilisateur_id, Rôle } = req.user;
    const { oldPassword, newPassword } = req.body;

    // 🚫 Admins must use the dedicated route
    if (Rôle === 'Admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Les administrateurs doivent utiliser la route spéciale pour changer un mot de passe.'
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Ancien et nouveau mot de passe requis.',
        error: 'Champs manquants'
      });
    }

    const utilisateur = await Utilisateur.findByPk(utilisateur_id);
    if (!utilisateur) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur introuvable.',
        error: 'ID utilisateur invalide'
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, utilisateur.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Ancien mot de passe incorrect.',
        error: 'Comparaison échouée'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    utilisateur.password = hashedPassword;
    await utilisateur.save();

    return res.status(200).json({
      status: 'success',
      message: 'Mot de passe mis à jour avec succès.'
    });

  } catch (error) {
    console.error('[UPDATE PASSWORD] Erreur:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la mise à jour du mot de passe.',
      error: error.message
    });
  }
};