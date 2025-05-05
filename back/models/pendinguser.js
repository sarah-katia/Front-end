const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PendingUser = sequelize.define("PendingUser", {
  pending_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Common fields between Utilisateur and Chercheur
  nom_complet: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Mails: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  Tél: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Rôle: {
    type: DataTypes.ENUM("Chercheur", "Assistant"),
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: "https://res.cloudinary.com/dv5ylazxm/image/upload/v1746196561/Unknown_person_gffmfs.jpg"
  },
  // Status of the request
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending"
  },
  
  // Additional fields for Chercheur
  Diplôme: {
    type: DataTypes.STRING,
    allowNull: true, // Required only for Chercheur
  },
  Etablissement_origine: {
    type: DataTypes.STRING,
    allowNull: true, // Required only for Chercheur
  },
  Qualité: {
    type: DataTypes.STRING,
    allowNull: true, // Required only for Chercheur
  },
  Equipe: {
    type: DataTypes.STRING,
    allowNull: true, // Required only for Chercheur
  },
  Orcid: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for Chercheur
  },
  Grade_Enseignemet: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for Chercheur
  },
  Lien_DBLP: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for Chercheur
  },
  Lien_GoogleScholar: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for Chercheur
  },
});

module.exports = PendingUser;