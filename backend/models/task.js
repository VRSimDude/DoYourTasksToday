const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: { type: String, required: true, maxLength: 128 },
  description: { type: String, maxLength: 500 },
  status: { type: String, required: true, default: "backlog" },
  order: { type: String, default: "0" },
  priority: { type: String, default: "medium" },
  dueDate: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("task", taskSchema);
