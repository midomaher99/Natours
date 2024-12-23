const express = require("express");
const userController = require("../controllers/userController")
const router = express.Router();
const authController = require(`${__dirname}/../controllers/authController`);

router.post("/signup", authController.signup);

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