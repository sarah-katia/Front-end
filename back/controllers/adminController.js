const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Utilisateur, Chercheur } = require('../models');
const nodemailer = require('nodemailer');
const transporter = require('../utiles/mailer.js');



// ✅ Email format validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Create User — 🔒 Admin only
exports.createUser = async (req, res) => {
  try {
    // 🔐 Check if requester is Admin
    if (req.user?.Rôle !== 'Administrateur') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les administrateurs peuvent créer des utilisateurs.'
      });
    }

    let { Mails, Rôle, Tél, chercheur_id, nom_complet } = req.body;

    if (!Mails || !Rôle) {
      console.warn('[CREATE USER] Champs requis manquants');
      return res.status(400).json({
        status: 'error',
        message: 'Mails et Rôle sont requis.',
        error: 'Champs manquants'
      });
    }

    if (!isValidEmail(Mails)) {
      console.warn('[CREATE USER] Email invalide:', Mails);
      return res.status(400).json({
        status: 'error',
        message: "Format d'email invalide.",
        error: 'Email regex failed'
      });
    }

    if (Rôle === 'Chercheur' && !chercheur_id) {
      console.warn('[CREATE USER] chercheur_id manquant pour Chercheur');
      return res.status(400).json({
        status: 'error',
        message: 'chercheur_id requis pour un chercheur.',
        error: 'Rôle Chercheur sans ID'
      });
    }

    if (Rôle !== 'Chercheur') {
      chercheur_id = null;
    }

    if (Rôle === 'Chercheur' && chercheur_id) {
      const chercheur = await Chercheur.findByPk(chercheur_id);
      if (!chercheur) {
        return res.status(400).json({
          status: 'error',
          message: "Le chercheur_id fourni n'existe pas.",
          error: 'Chercheur introuvable'
        });
      }
      if (chercheur.Mails !== Mails) {
        return res.status(400).json({
          status: 'error',
          message: "L'email ne correspond pas au chercheur enregistré.",
          error: 'Mismatch Mails / chercheur_id'
        });
      }
    }

    const existingUser = await Utilisateur.findOne({ where: { Mails } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Un compte avec cet e-mail existe déjà.',
        error: 'Utilisateur existant'
      });
    }

    const plainPassword = Math.random().toString(36).slice(-10);
    console.log(`[CREATE USER] Mot de passe pour ${Mails} : ${plainPassword}`);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const count = await Utilisateur.count();
    const utilisateurId = count + 1;

    const utilisateur = await Utilisateur.create({
      utilisateur_id: utilisateurId,
      Mails,
      password: hashedPassword,
      Tél,
      chercheur_id: chercheur_id || null,
      Rôle ,
      nom_complet // <- Add the value for nom_complet here
    });

    try {
      await transporter.sendMail({
        from: '"ESI Auth System" <lmcslabo@gmail.com>',
        to: Mails,
        subject: 'Votre compte a été créé',
        html: `
        <p>Bonjour,</p>
        <p>
          Bienvenue dans votre espace personnel sur la plateforme LMCS. <br>
          Nous sommes ravis de vous compter parmi nous !
        </p>
        <p>
          Voici les informations nécessaires pour vous connecter à votre compte :
          <br>
          <strong>Mot de passe temporaire :</strong> <b>${plainPassword}</b>
        </p>
        <p>
          Pour des raisons de sécurité, nous vous recommandons de modifier ce mot de passe dès votre première connexion.
        </p>
        <p>
          Si vous avez des questions ou besoin d’assistance, n’hésitez pas à nous contacter.
        </p>
        <p>Bonne utilisation,<br>L’équipe LMCS</p>
      `      });
    } catch (err) {
      console.error('[EMAIL] Échec envoi email:', err);
    }

    return res.status(201).json({
      status: 'success',
      message: 'Compte créé et email envoyé.',
      data: { utilisateur_id: utilisateur.utilisateur_id }
    });

  } catch (error) {
    console.error('[CREATE USER] Erreur serveur:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de la création du compte.',
      error: error.message
    });
  }
};



// ✅ Admin-only password override
exports.adminUpdatePassword = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.user?.Rôle !== 'Administrateur') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès refusé : seuls les administrateurs peuvent modifier les mots de passe.'
      });
    }

    const { Mails, newPassword } = req.body;

    if (!Mails || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Mails et nouveau mot de passe requis.'
      });
    }

    const utilisateur = await Utilisateur.findOne({ where: { Mails } });
    if (!utilisateur) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur introuvable.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    utilisateur.password = hashedPassword;
    await utilisateur.save();

    return res.status(200).json({
      status: 'success',
      message: 'Mot de passe mis à jour par l’administrateur.'
    });

  } catch (error) {
    console.error('[ADMIN UPDATE PASSWORD] Erreur:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur.',
      error: error.message
    });
  }
};