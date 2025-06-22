const mongoose = require("mongoose");

const subtaskSchema = mongoose.Schema({
  title: { type: String, required: true, maxLength: 128 },
  status: { type: String, required: true, default: "todo" },
  order: { type: String, default: "0" },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
    required: true,
  },
});

module.exports = mongoose.model("subtask", subtaskSchema);
