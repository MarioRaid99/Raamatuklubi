const BooksController = require("../controllers/BooksController")
//kui tuleb veel controllereid siis tuleb need siia lisada.

module.exports = (app) => {
    app.route("/books")
    .get(BooksController.getAll)
}
//Kui tuleb uus moodul tuleb see samamoodi siia lisada.