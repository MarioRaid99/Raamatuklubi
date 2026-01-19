module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    EventID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
  });

  return Event;
};
