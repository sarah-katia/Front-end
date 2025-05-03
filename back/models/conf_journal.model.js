const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");  

const ConfJournal = sequelize.define("Conf_Journal", {
  publication_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nom: DataTypes.STRING,
  type: DataTypes.STRING,
  thematique: DataTypes.STRING,
  scope: DataTypes.STRING,
  lieu: DataTypes.STRING,
  periode: DataTypes.STRING,
  periodicite: DataTypes.STRING,
});

module.exports = ConfJournal;
