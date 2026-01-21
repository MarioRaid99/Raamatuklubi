const UserBooksController = require("../controllers/UserBooksController");
const { requireAuth } = require("../middleware/auth");

module.exports = (app) => {
  app.get("/me/books", requireAuth, UserBooksController.getMyBooks);
  app.post("/me/books", requireAuth, UserBooksController.addToMyBooks);
  app.patch("/me/books/:BookID", requireAuth, UserBooksController.updateMyBook);
  app.delete("/me/books/:BookID", requireAuth, UserBooksController.removeFromMyBooks);
};
