import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        taskID: Date.now().toString(),
        taskName: newTask,
        taskDescription: '',
        status: 'Pending'
      };

      fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTasks(prevTasks => [...prevTasks, task]);
          } else {
            console.error('Failed to add task:', data.error);
          }
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });

      setNewTask('');
    }
  };

  const removeTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    const taskToUpdate = tasks.find(task => task.taskID === taskId);
    if (!taskToUpdate) return;
  
    const updatedStatus = taskToUpdate.status === 'Pending' ? 'Completed' : 'Pending';
  
    fetch(`http://localhost:3001/tasks/${taskId}`, { 
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: updatedStatus })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.taskID === taskId) {
            return { ...task, status: updatedStatus };
          }
          return task;
        }));
      }
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
            <button onClick={() => removeTask(task.taskID)}>Delete</button> {/* This function needs to be defined */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

