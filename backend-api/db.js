require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DBNAME,
  process.env.DB_USERNAME,
  process.env.DB_USERPASS,
  {
    host: process.env.DB_HOSTNAME,
    dialect: "mariadb",
    logging: false, // pane true kui tahad SQL logi
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.books = require("./models/Book")(sequelize, DataTypes);
db.events = require("./models/Event")(sequelize, Sequelize.DataTypes);
db.users = require("./models/Users")(sequelize, Sequelize.DataTypes);
db.userBooks = require("./models/UserBooks")(sequelize, Sequelize.DataTypes);

// Many-to-many
db.users.belongsToMany(db.books, {
  through: db.userBooks,
  foreignKey: "UserID",
  otherKey: "BookID",
});

db.books.belongsToMany(db.users, {
  through: db.userBooks,
  foreignKey: "BookID",
  otherKey: "UserID",
});

// (optional, mugavam include jaoks)
db.userBooks.belongsTo(db.books, { foreignKey: "BookID" });
db.userBooks.belongsTo(db.users, { foreignKey: "UserID" });




const connect = async () => {
  await sequelize.authenticate();
  console.log("Connection has been established successfully, yippie!");
};

const sync = async () => {
  await sequelize.sync({ alter: true });
  console.log("DB sync has been completed!");
};

module.exports = { db, connect, sync };
