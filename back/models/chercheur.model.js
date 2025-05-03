const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Chercheur = sequelize.define("Chercheur", {
  chercheur_id: { type: DataTypes.STRING, primaryKey: true },
  nom_complet: DataTypes.STRING,
  Mails: DataTypes.STRING,
  Tél: DataTypes.STRING,
  Diplôme: DataTypes.STRING,
  Etablissement_origine: DataTypes.STRING,
  Qualité: DataTypes.STRING,
  Grade_Recherche: {type: DataTypes.STRING, allowNull : true},
  Statut: {type: DataTypes.ENUM("Actif", "Inactif"),defaultValue: "Actif",},
  Hindex: DataTypes.INTEGER,
  Equipe: DataTypes.STRING,
  Orcid: DataTypes.STRING,
  Grade_Enseignemet: {type: DataTypes.STRING, allowNull : true},
  Chef_Equipe: {type: DataTypes.BOOLEAN ,defaultValue:false},
  Lien_DBLP: {type: DataTypes.STRING, allowNull : true},
  Lien_GoogleScholar:{type: DataTypes.STRING, allowNull : true},
  photo: DataTypes.STRING,
});


module.exports = Chercheur;
