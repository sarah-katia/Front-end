const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Publication = sequelize.define("Publication", {
  publication_id: { type: DataTypes.STRING, primaryKey: true },
  chercheur_id: { type: DataTypes.STRING, primaryKey: true },
  titre_publication: DataTypes.STRING,
  nombre_pages: DataTypes.INTEGER,
  volumes: DataTypes.STRING,
  lien: DataTypes.STRING,  
  annee: DataTypes.INTEGER,
  auteurs: DataTypes.TEXT,
  publisher: DataTypes.STRING,
  book: DataTypes.STRING,
  editors: DataTypes.TEXT
});
module.exports = Publication;
