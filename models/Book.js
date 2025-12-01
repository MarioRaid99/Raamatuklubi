

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define(
        'Book', {
            BookID: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUID,
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            UserScore: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            Pages: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            ReleaseYear: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            Language: {
                type: DataTypes.STRING,
                allowNull: false
            },
        }
    )
    console.log(Book === sequelize.models.Book)
    return Book;
}