// server.js
require('dotenv').config()
const express = require('express');
// const dotenv = require('dotenv');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
// const bodyParser = require('body-parser');

// Import routes and middleware
const { register, login } = require('./controllers/authController');
const { createTask, getTasks, updateTask, deleteTask } = require('./controllers/taskController');
const authenticateToken = require('./middleware/authMiddleware');
const { Server } = require('http');

// dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(taskRoutes);

// MongoDB connection
require('./config/db');

// Routes
app.post('/register', register);
app.post('/login', login);

app.post('/tasks', authenticateToken, createTask);
app.get('/tasks', authenticateToken, getTasks);
app.put('/tasks/:id', authenticateToken, updateTask);
app.delete('/tasks/:id', authenticateToken, deleteTask);

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



module.exports = {app, server} ;
