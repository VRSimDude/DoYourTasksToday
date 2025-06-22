const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/user");

router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/changePassword", checkAuth, userController.changePassword);
router.delete("/delete", checkAuth, userController.deleteUser);

module.exports = router;
