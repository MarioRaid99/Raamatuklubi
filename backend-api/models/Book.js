module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      BookID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      Name: { type: DataTypes.STRING, allowNull: false },
      Description: { type: DataTypes.STRING, allowNull: false },
      UserScore: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
      Pages: { type: DataTypes.INTEGER, allowNull: false },
      ReleaseYear: { type: DataTypes.INTEGER, allowNull: false },
      Language: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "Books",
      timestamps: true,
    }
  );

  return Book;
};
