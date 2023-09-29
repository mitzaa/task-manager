const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        let response = await fetch('https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task');
        let data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/tasks', async (req, res) => {
    try {
        let response = await fetch('https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        let data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.put('/tasks/:taskId', async (req, res) => {
    try {
        let response = await fetch(`https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task/${req.params.taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        let data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/tasks/:taskId', async (req, res) => {
    try {
        let response = await fetch(`https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task/${req.params.taskId}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            res.status(204).send();
        } else {
            let data = await response.json();
            res.json(data);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});