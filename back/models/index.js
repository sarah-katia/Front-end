const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Chercheur = require("./chercheur.model");
const Publication = require("./publication.model");
const ConfJournal = require("./conf_journal.model");
const Classement = require("./classement.model");
const PubClassement = require("./pub_classement.model");
const Utilisateur = require("./utilisateur.model");

// === ASSOCIATIONS ===

// Chercheur-Publication 
Chercheur.hasMany(Publication, { foreignKey: "chercheur_id" });
Publication.belongsTo(Chercheur, { foreignKey: "chercheur_id" });

// Publication-ConfJournal 
Publication.hasOne(ConfJournal, { foreignKey: "publication_id", targetKey: "publication_id" });
ConfJournal.belongsTo(Publication, { foreignKey: "publication_id", sourceKey: "publication_id" });

// ConfJournal-PubClassement 
ConfJournal.hasMany(PubClassement, { foreignKey: "publication_id", sourceKey: "publication_id" });
PubClassement.belongsTo(ConfJournal, { foreignKey: "publication_id", targetKey: "publication_id" });

// Classement-PubClassement
Classement.hasMany(PubClassement, { foreignKey: "class_id" });
PubClassement.belongsTo(Classement, { foreignKey: "class_id" });

// Chercheur-Utilisateur 
Chercheur.hasOne(Utilisateur, { foreignKey: "chercheur_id" });
Utilisateur.belongsTo(Chercheur, { foreignKey: "chercheur_id" });

// === SYNCHRONISATION ===

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie !");
    
    // Synchronize models in order of dependency

   // 1. First, sync models with no dependencies (base tables)
   await Chercheur.sync({ alter: true });
   await Classement.sync({ alter: true });
   
   // 2. Then sync models that depend on one parent table
   await Publication.sync({ alter: true });
   await ConfJournal.sync({ alter: true });
   await Utilisateur.sync({ alter: true });
   
   // 3. Finally sync junction tables with multiple dependencies
   await PubClassement.sync({ alter: true });
    
    console.log("Synchronisation des modèles réussie !");
  } catch (error) {
    console.error("Erreur lors de la synchronisation :", error);
  }
};

module.exports = {
  sequelize, 
  Chercheur,
  Publication,
  ConfJournal,
  Classement,
  PubClassement,
  Utilisateur,
};
