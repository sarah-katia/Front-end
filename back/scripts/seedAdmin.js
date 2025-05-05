const bcrypt = require('bcrypt');
const { Utilisateur } = require('../models');

async function seedAdmin() {
  try {
    const existingAdmin = await Utilisateur.findOne({ where: { Rôle: 'Administrateur' } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

      await Utilisateur.create({
        utilisateur_id: 1,
        nom_complet: 'weew',
        Mails: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: hashedPassword,
        Rôle: 'Administrateur',
        Tél: '0000000000',
        chercheur_id: null
      });

      console.log('✅ Admin initial créé avec succès.');
    } else {
      console.log('ℹ️ Admin existe déjà.');
    }
  } catch (err) {
    console.error('❌ Erreur lors de la création de l’admin:', err);
  }
}

module.exports = seedAdmin;