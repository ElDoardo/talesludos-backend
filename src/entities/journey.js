'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Journey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Journey.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    imagePath: DataTypes.STRING,
    area_id: DataTypes.INTEGER,
    publish: DataTypes.BOOLEAN,
    gameType: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Journey',
  });
  return Journey;
};