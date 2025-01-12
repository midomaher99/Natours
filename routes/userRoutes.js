const express = require("express");
const userController = require(`${__dirname}/../controllers/userController`)
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router();



router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);
router.patch("/reset-password/:token", authController.resetPassword);
router.post("/forgot-password", authController.forgotPassword);

router.use(authController.isLoggedIn)

router.patch("/update-password", authController.updatePassword);
router.route("/me")
    .patch(userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe)
    .delete(userController.deleteMe)
    .get(userController.getMe, userController.getUser);

router.use(authController.restrictedTo('admin'))

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