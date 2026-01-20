module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      UserID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      PasswordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      First_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Phone_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Role: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
        defaultValue: "USER",
      },
    },
    {
      tableName: "Users",
    }
  );

  return User;
};
