const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize AWS SDK and DynamoDB
AWS.config.update({ region: 'us-east-1' }); 
const dynamodb = new AWS.DynamoDB.DocumentClient();


// Add a new task
app.post('/tasks', (req, res) => {
  const { taskID, taskName, taskDescription, status } = req.body;
  console.log("Received request to add task:", req.body);
  
  const params = {
    TableName: 'TaskManagerTasks', 
    Item: {
      taskID,
      taskName,
      taskDescription,
      status
    }
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Error adding task to DynamoDB:", err);
      res.status(500).json({ error: 'Unable to add task', details: err });
    } else {
      res.json({ success: true, message: 'Task added successfully' });
    }
  });
});


app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

