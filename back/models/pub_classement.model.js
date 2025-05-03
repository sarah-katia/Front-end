const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PubClassement = sequelize.define("Pub_Classement", {
  publication_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    field: "publication_id"  
  },
  class_id: {
    type: DataTypes.INTEGER,  
    primaryKey: true,
  },
  classement: DataTypes.STRING,  
  lien_vers_classement: DataTypes.STRING  
});

module.exports = PubClassement;