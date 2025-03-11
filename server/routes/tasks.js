const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticateUser = require("../middleware/auth");

// Create a Task (only for logged-in users)
router.post("/", authenticateUser, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user._id }); // Associate task with the logged-in user
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Get all Tasks (only for the logged-in user)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }); // Fetch tasks only for the logged-in user
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Update a Task (only for the logged-in user)
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id }); // Ensure the task belongs to the logged-in user
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete a Task (only for the logged-in user)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id }); // Ensure the task belongs to the logged-in user
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

module.exports = router;