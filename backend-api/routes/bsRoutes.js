const BooksController = require("../controllers/BooksController");

module.exports = (app) => {
  app.route("/books")
    .get(BooksController.getAll)
    .post(BooksController.create);

  app.route("/books/:BookID")
    .get(BooksController.getByID)
    .delete(BooksController.deleteById);
};
