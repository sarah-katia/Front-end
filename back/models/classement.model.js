const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Classement = sequelize.define("Classement", {
  class_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nom: DataTypes.STRING,
  Type: DataTypes.STRING,
});

module.exports = Classement;
