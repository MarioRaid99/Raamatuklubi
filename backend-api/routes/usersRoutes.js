const UsersController = require("../controllers/UsersController");
const { requireAuth, requireRole } = require("../middleware/auth");

module.exports = (app) => {
  app.get("/users/me", requireAuth, UsersController.getMe);
  app.patch("/users/me", requireAuth, UsersController.updateMe);

  // ADMIN only
  app.get("/users", requireAuth, requireRole("ADMIN"), UsersController.getAll);
};
