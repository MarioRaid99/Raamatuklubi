const EventsController = require("../controllers/EventsController");

module.exports = (app) => {
  app
    .route("/events")
    .get(EventsController.getAll)
    .post(EventsController.create);

  app
    .route("/events/:EventID")
    .get(EventsController.getByID)
    .patch(EventsController.updateById)
    .delete(EventsController.deleteById);
};
