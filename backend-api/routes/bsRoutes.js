const BooksController = require("../controllers/BooksController")
const EventsController = require("../controllers/EventsController");
//kui tuleb veel controllereid siis tuleb need siia lisada.

module.exports = (app) => {
    app.route("/books")
    .get(BooksController.getAll)
    .post(BooksController.create)
    app.route("/books/:BookID")
    .get(BooksController.getByID)
    .delete(BooksController.deleteById)
    
    app.route("/events")
    .get(EventsController.getAll)
    .post(EventsController.create)

    app.route("/events/:UniqueID")
    .put(EventsController.modify)

    //Kui tuleb uus moodul tuleb see samamoodi siia lisada.
}

