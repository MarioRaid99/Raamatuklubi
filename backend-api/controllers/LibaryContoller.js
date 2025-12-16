const { DataTypes } = require("sequelize");

module.exports = (sequlize, DataTypes) => { 
    const Book = this.sequlize.define ( 
        "Book", {
            BookID: {
                type: DataTypes.UUID,
                primaryKey: True, 
                autoIncrement: true,
            }, 
            Name: { 
                type: DataTypes.STRING, 
                allowNull: false
            }, 
            Description: { 
                type:DataTypes.STRING,
                allowNull: false
            },
            UserScore: { 
                type: DataTypes.DECIMAL,
                allownull: false
            },
            
        }
    )
}