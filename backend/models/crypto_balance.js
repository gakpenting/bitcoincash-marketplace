'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class crypto_balance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  crypto_balance.init({
    username: DataTypes.STRING,
    address: DataTypes.STRING,
    type: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    main: DataTypes.BOOLEAN,
    mnemonic: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'crypto_balance',
  });
  return crypto_balance;
};