const router = require("express").Router();
const UserCtrl = require("../controllers/UserController");
const upload = require("../config/multerConfig");
const auth = require('../middlewares/auth')

const singleUpload = upload.single('photo')

module.exports = function () {
  router.post("/", UserCtrl.add);
  router.post("/auth", auth(),UserCtrl.authenticate);

  router.post("/confirm", UserCtrl.confirmToken);
  router.post("/resendToken", UserCtrl.resendToken);

  router.get("/", auth(), UserCtrl.getMany);
  router.get("/:userId", auth(), UserCtrl.getById);

  router.put("/:userId", auth(), UserCtrl.update);

  router.delete("/:userId", auth(), UserCtrl.delete);

  router.put('/uploadPhoto/:userId', auth(), singleUpload, UserCtrl.uploadProfilePicture);

  return router;
};
