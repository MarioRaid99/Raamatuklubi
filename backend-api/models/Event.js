module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      UniqueID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
      },
      Event_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Description: {
        type: DataTypes.STRING
      },
      User_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      Start_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      Created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      Location: {
        type: DataTypes.STRING
      }
    }
  );

  console.log(Event === sequelize.models.Event);
  return Event;
};
