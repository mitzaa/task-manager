const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize AWS SDK and DynamoDB
AWS.config.update({ region: 'us-east-1' });
// const dynamodb = new AWS.DynamoDB.DocumentClient();


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
    }

});


app.patch('/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    updateTaskInDynamoDB(taskId, status, (err, data) => {
        if (err) {
            console.error("Error updating task in DynamoDB:", err);
            res.status(500).json({ success: false, error: 'Unable to update task' });
        } else {
            res.json({ success: true });
        }
    });
});


app.delete('/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;
  
    deleteTaskFromDynamoDB(taskId, (err, data) => {
      if (err) {
        console.error("Error deleting task from DynamoDB:", err);
        res.status(500).json({ success: false, error: 'Unable to delete task' });
      } else {
        res.json({ success: true });
      }
    });
});


app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');

});