module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      UserID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
      },
      First_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false
        // soovi korral: unique: true
      },
      Phone_number: {
        type: DataTypes.INTEGER
      }
    }
  );

  console.log(User === sequelize.models.User);
  return User;
};
