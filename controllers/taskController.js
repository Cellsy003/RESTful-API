// controllers/taskController.js
const Task = require('../models/taskModel');

// Create a task
const createTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const task = new Task({
        title,
        description,
        status,
        dueDate,
        userId: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
};

// Get all tasks for the user
const getTasks = async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
};

// Update task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { title, description, status, dueDate },
        { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
};

// Delete task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };

