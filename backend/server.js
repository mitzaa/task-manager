const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// AWS SDK Configuration
AWS.config.update({
  region: 'us-east-1'
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Add a task
app.post('/tasks', (req, res) => {
  const { taskId, taskName, taskDescription, status } = req.body;

  const params = {
    TableName: 'TaskManagerTasks',
    Item: {
      taskId,
      taskName,
      taskDescription,
      status
    }
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      res.status(500).json({ error: "Unable to add task" });
    } else {
      res.json({ success: true, message: "Task added successfully" });
    }
  });
});

// Retrieve a task by its ID
app.get('/tasks/:taskId', (req, res) => {
  const params = {
    TableName: 'TaskManagerTasks',
    Key: {
      taskId: req.params.taskId
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      res.status(500).json({ error: "Unable to retrieve task" });
    } else {
      res.json(result.Item);
    }
  });
});

// Update a task's status
app.patch('/tasks/:taskId', (req, res) => {
  const { status } = req.body;

  const params = {
    TableName: 'TaskManagerTasks',
    Key: {
      taskId: req.params.taskId
    },
    UpdateExpression: "set status = :s",
    ExpressionAttributeValues: {
      ":s": status
    }
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
app.delete('/tasks/:taskId', (req, res) => {
  const params = {
    TableName: 'TaskManagerTasks',
    Key: {
      taskId: req.params.taskId
    }
  };

  dynamoDb.delete(params, (error) => {
    if (error) {
      res.status(500).json({ error: "Unable to delete task" });
    } else {
      res.json({ success: true, message: "Task deleted successfully" });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
