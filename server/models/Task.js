const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate task with a user
});

module.exports = mongoose.model("Task", TaskSchema);