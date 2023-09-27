const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const app = express();
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' })); 



// Middleware to parse JSON requests
app.use(bodyParser.json());

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1' 
  });

// Create a DynamoDB DocumentClient instance
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, Task Manager Backend'); 
});

// Add a task
app.post('/tasks', (req, res) => {
  const { taskID, taskName, taskDescription, status } = req.body;

  const params = {
    TableName: 'TaskManagerTasks',
    Item: {
      taskID,
      taskName,
      taskDescription,
      status,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.error("Error adding task:", error); // Log the error for debugging
      res.status(500).json({ error: "Unable to add task", details: error.message});
    } else {
      res.json({ success: true, message: "Task added successfully" });
    }
  });
});

// Retrieve a task by its ID
app.get('/tasks/:taskID', (req, res) => {
  const params = {
    TableName: 'TaskManagerTasks',
    Key: {
      taskID: req.params.taskID,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      res.status(500).json({ error: "Unable to retrieve task" });
    } else {
      res.json(result.Item);
    }
  });
});

// Retrieve all tasks
app.get('/tasks', (req, res) => {
  const params = {
    TableName: 'TaskManagerTasks',
  };

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      res.status(500).json({ error: "Unable to retrieve tasks" });
    } else {
      res.json(result.Items);
    }
  });
});

// Update a task's status
app.patch('/tasks/:taskID', (req, res) => {
  const { status } = req.body;

  const params = {
    TableName: 'TaskManagerTasks',
    Key: {
      taskID: req.params.taskID,
    },
    UpdateExpression: "set status = :s",
    ExpressionAttributeValues: {
      ":s": status,
    },
  };

  dynamoDb.update(params, (error) => {
    if (error) {
      res.status(500).json({ error: "Unable to update task" });
    } else {
      res.json({ success: true, message: "Task updated successfully" });
    }
  });
});

// Delete a task
app.delete('/tasks/:taskID', (req, res) => {
  const params = {
    TableName: 'TaskManagerTasks',
    Key: {
      taskID: req.params.taskID,
    },
  };

  dynamoDb.delete(params, (error) => {
    if (error) {
      res.status(500).json({ error: "Unable to delete task" });
    } else {
      res.json({ success: true, message: "Task deleted successfully" });
    }
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", err);

  // Send an error response to the client
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = 3001;
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

