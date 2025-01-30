# Task Management API

## Table of Contests
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#Technologies-Used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This is a RESTful API for a simple task management system. It allows users to create, read, update, and delete tasks. Each task includes a title, description, status, and due date.

## Features
- Create a new task

- Retrieve all tasks

- Retrieve a single task by ID

- Update a task

- Delete a task

## Technologies Used

- Node.js

- Express.js

- MongoDB (Mongoose ORM)

- RESTful API principles

- JWT Authentication for user management

- dotenv for environment variable management

## Installation

Prerequisites
Install Node.js
Install MongoDB

Setup
1. Clone the repository: git clone https://github.com/Cellsy003/RESTful-API.git

2. Navigate to the project directory: cd task-management-api

3. Install dependencies: npm install express mongoose bcrypt dotenv jsonwebtoken

4. Install devdependencies: npm install --save-dev jest supertest

## Usage

Usage

1. Start the server: npm start

2. API Endpoints:

GET /tasks - Retrieve all tasks with optional pagination and filters

GET /tasks/:id - Retrieve a single task by ID

POST /tasks - Create a new task (requires authentication)

PUT /tasks/:id - Update a task (requires authentication)

DELETE /tasks/:id - Delete a task (requires authentication)

## Contributing

We welcome contributions.To contribute, follow these steps:

1.Fork the repository.

2.Create a new branch (git checkout -b feature-branch).

3.Make your changes and commit them (git commit -m 'Add new feature').

4.Push to the branch (git push origin feature-branch).

5.Open a pull request.

## License

This project is licensed under the MIT License.








