const EventsController = require("../controllers/EventsController");
const { requireAuth, requireRole } = require("../middleware/auth");

module.exports = (app) => {
  app.get("/events", EventsController.getAll);
  app.get("/events/:EventID", EventsController.getByID);

  app.post("/events", requireAuth, requireRole("ADMIN"), EventsController.create);
  app.patch("/events/:EventID", requireAuth, requireRole("ADMIN"), EventsController.updateById);
  app.put("/events/:EventID", requireAuth, requireRole("ADMIN"), EventsController.replaceById);
  app.delete("/events/:EventID", requireAuth, requireRole("ADMIN"), EventsController.deleteById);
};
