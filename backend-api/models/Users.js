module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
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

      FirstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      LastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Role: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
        defaultValue: "USER",
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Users;
};
