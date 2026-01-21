module.exports = (sequelize, DataTypes) => {
  const UserBooks = sequelize.define(
    "userBooks",
    {
      UserBookID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      UserID: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      BookID: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      UserScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      ImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "userBooks",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["UserID", "BookID"], 
        },
      ],
    }
  );

  return UserBooks;
};
