const BooksController = require("../controllers/BooksController")
const UsersController = require("../controllers/UsersController");
//kui tuleb veel controllereid siis tuleb need siia lisada.

module.exports = (app) => {
    app.route("/books")
    .get(BooksController.getAll)
    .post(BooksController.create)
    app.route("/books/:BookID")
    .get(BooksController.getByID)
    .delete(BooksController.deleteById)
    
    app.route("/users")
  .get(UsersController.getAll);

  app.route("/users/:UserID")
  .get(UsersController.getByID);

    //Kui tuleb uus moodul tuleb see samamoodi siia lisada.
}





