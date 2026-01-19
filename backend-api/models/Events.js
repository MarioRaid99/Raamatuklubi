module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      EventID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      StartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Events",
    }
  );

  return Event;
};
