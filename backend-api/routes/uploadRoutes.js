const { requireAuth } = require("../middleware/auth");
const UploadController = require("../controllers/UploadController");

module.exports = (app) => {
  app.post(
    "/upload",
    requireAuth,
    UploadController.uploadSingle,
    UploadController.uploadImage
  );
};
