const express = require("express");
const userController = require(`${__dirname}/../controllers/userController`)
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.patch("/reset-password/:token", authController.resetPassword);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/update-password", authController.isLoggedIn, authController.updatePassword);
router.route("/me")
    .patch(authController.isLoggedIn, userController.updateMe)
    .delete(authController.isLoggedIn, userController.deleteMe)
    .get(authController.isLoggedIn, userController.getMe, userController.getUser);

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