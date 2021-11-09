const { Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define(
    'ContactUs',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'contact_us', underscored: true }
  );

  return ContactUs;
};
