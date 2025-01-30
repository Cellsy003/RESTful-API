const request = require('supertest'); // Supertest for API testing
const mongoose = require('mongoose'); // To handle MongoDB connection
const {app} = require('./app'); // Your main app file
const User = require('./models/userModel'); // User model
const Task = require('./models/taskModel'); // Task model

const { server } = require('./app');

// Mock environment variables
const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key';

// Test user credentials
const testUser = { username: 'testuser', password: 'password123' };

// Hooks for MongoDB setup and teardown
beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll((done) => {
  server.close(done);  // Close the server after the tests
});

afterAll(async () => {
  // Drop the test database and close the connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});

describe('User Authentication and Task Management', () => {
  let token; // Store JWT token for authenticated requests

  // Test user registration
  test('POST /register - should register a new user', async () => {
    const response = await request(app).post('/register').send(testUser);

    expect(response.status).toBe(201); // HTTP status code 201: Created
    expect(response.body.message).toBe('User registered successfully');
  });

  // Test user login
  test('POST /login - should log in a user and return a token', async () => {
    // First, register the user
    await request(app).post('/register').send(testUser);

    // Then, log in with the same credentials
    const response = await request(app).post('/login').send(testUser);

    expect(response.status).toBe(200); // HTTP status code 200: OK
    expect(response.body.token).toBeDefined(); // Ensure a token is returned

    token = response.body.token; // Save the token for authenticated requests
  });

  // Test creating a new task
  test('POST /tasks - should create a new task for an authenticated user', async () => {
    // First, register and log in the user
    await request(app).post('/register').send(testUser);
    const loginResponse = await request(app).post('/login').send(testUser);
    token = loginResponse.body.token;

    // Create a new task
    const taskData = {
      title: 'New Task',
      description: 'This is a test task',
      status: 'in-progress',
      dueDate: '2025-01-01',
    };
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', token) // Add the token in the Authorization header
      .send(taskData);

    expect(response.status).toBe(201); // HTTP status code 201: Created
    expect(response.body.title).toBe(taskData.title); // Ensure the task was created correctly
  });

  // Test fetching all tasks for an authenticated user
  test('GET /tasks - should fetch all tasks for an authenticated user', async () => {
    // First, register and log in the user
    await request(app).post('/register').send(testUser);
    const loginResponse = await request(app).post('/login').send(testUser);
    token = loginResponse.body.token;

    // Create a new task
    await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task 1' });

    // Fetch tasks
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', token);

    expect(response.status).toBe(200); // HTTP status code 200: OK
    expect(response.body.length).toBe(1); // Ensure 1 task is returned
    expect(response.body[0].title).toBe('Task 1'); // Verify task title
  });

  // Test updating a task
  test('PUT /tasks/:id - should update an existing task', async () => {
    // First, register and log in the user
    await request(app).post('/register').send(testUser);
    const loginResponse = await request(app).post('/login').send(testUser);
    token = loginResponse.body.token;

    // Create a new task
    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task to Update' });

    const taskId = createResponse.body._id;

    // Update the task
    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', token)
      .send({ title: 'Updated Task' });

    expect(updateResponse.status).toBe(200); // HTTP status code 200: OK
    expect(updateResponse.body.title).toBe('Updated Task'); // Verify updated title
  });

  // Test deleting a task
  test('DELETE /tasks/:id - should delete an existing task', async () => {
    // First, register and log in the user
    await request(app).post('/register').send(testUser);
    const loginResponse = await request(app).post('/login').send(testUser);
    token = loginResponse.body.token;

    // Create a new task
    const createResponse = await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task to Delete' });

    const taskId = createResponse.body._id;

    // Delete the task
    const deleteResponse = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', token);

    expect(deleteResponse.status).toBe(200); // HTTP status code 200: OK
    expect(deleteResponse.body.message).toBe('Task deleted successfully');
  });
});