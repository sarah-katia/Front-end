const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require('bcrypt');

const Utilisateur = sequelize.define("Utilisateur", {
  utilisateur_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Mails: {  // <- comme dans Chercheur
    type: DataTypes.STRING,
    allowNull: false,

    validate: {
      isEmail: true
    }
  },
  nom_complet:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Tél: {  // <- comme dans Chercheur
    type: DataTypes.STRING,
    allowNull: true,
  },
  chercheur_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Rôle: {  // <- même casse que Chercheur
    type: DataTypes.ENUM("Administrateur", "Chercheur", "Assistant", "Directeur"),
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});



module.exports = Utilisateur;