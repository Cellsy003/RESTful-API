// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel'); // Adjust if the path is different

router.get('/tasks/next-due', async (req, res) => {
  try {
    const tasks = await Task.find({ dueDate: { $gte: new Date() }, completed: false })
      .sort({ dueDate: 1 }) // Sort by due date ascending
      .limit(3); // Get the next 3 tasks

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No upcoming tasks found' });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
