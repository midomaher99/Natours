const express = require("express");
const userController = require("../controllers/userController")
const router = express.Router();
const authController = require(`${__dirname}/../controllers/authController`);

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.patch("/reset-password/:token", authController.resetPassword);
router.post("/forgot-password", authController.forgotPassword);

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;