import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task', {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        taskID: Date.now().toString(),
        taskName: newTask,
        taskDescription: '',
        status: 'Pending'
      };

      fetch('https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      })
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data);
          if (data.message === 'Item created successfully') {
            setTasks(prevTasks => [...prevTasks, task]);
          } else {
            console.error('Failed to add task:', data.message);
          }
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });

      setNewTask('');
    }
  };

  const toggleTaskCompletion = (taskID) => {
    const taskToUpdate = tasks.find(task => task.taskID === taskID);
    if (!taskToUpdate) return;

    const updatedStatus = taskToUpdate.status === 'Pending' ? 'Completed' : 'Pending';

    fetch(`https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task/${taskID}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: updatedStatus })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTasks(prevTasks => {
            console.log("Updating task status in state for taskID:", taskID);
            return prevTasks.map(task => {
              if (task.taskID === taskID) {
                console.log("Found matching task. Setting status to:", updatedStatus);
                return { ...task, status: updatedStatus };
              }
              return task;
            });
          });
        }
      });
  };

  const deleteTask = (taskID) => {
    fetch(`https://u5iwo7ria4.execute-api.us-east-1.amazonaws.com/version2/task/${taskID}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.status === 204) {
          setTasks(prevTasks => prevTasks.filter(task => task.taskID !== taskID));
        } else {
          console.error("Error deleting task. HTTP status code:", response.status);
        }
      })
      .catch(error => {
        console.error("Fetch error:", error.message);
      });
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.taskID} style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={task.status === 'Completed'}
              onChange={() => toggleTaskCompletion(task.taskID)}
            />
            {task.taskName}
            <button onClick={() => deleteTask(task.taskID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
