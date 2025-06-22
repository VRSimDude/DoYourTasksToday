const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const taskController = require("../controllers/task");

router.get("/:id", checkAuth, taskController.getTask);
router.get("", checkAuth, taskController.getTasks);
router.post("/create", checkAuth, taskController.createTask);
router.put("/update", checkAuth, taskController.updateTask);
router.put("/move", checkAuth, taskController.moveTask);
router.delete("/delete/:id", checkAuth, taskController.deleteTask);

module.exports = router;
