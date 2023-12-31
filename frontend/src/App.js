import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks', {
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

      fetch('http://localhost:3001/tasks', {
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

    setTasks(prevTasks => {
        return prevTasks.map(task => {
            if (task.taskID === taskID) {
                return { ...task, status: updatedStatus };
            }
            return task;
        });
    });

    fetch(`http://localhost:3001/tasks/${taskID}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: updatedStatus })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message !== 'Item updated successfully') {
        console.error("API update failed with response:", data, ". Reverting task status in the UI.");
            setTasks(prevTasks => {
                return prevTasks.map(task => {
                    if (task.taskID === taskID) {
                        return { ...task, status: taskToUpdate.status }; // Revert to the original status
                    }
                    return task;
                });
            });
        }
    })
    .catch(error => {
        console.error("Fetch error:", error.message);
        // Handle other potential errors, like network issues
        // Revert the task's status in such cases
        setTasks(prevTasks => {
            return prevTasks.map(task => {
                if (task.taskID === taskID) {
                    return { ...task, status: taskToUpdate.status };
                }
                return task;
            });
        });
    });
};

const deleteTask = (taskID) => {
  fetch(`http://localhost:3001/tasks/${taskID}`, {
    method: 'DELETE'
  })
  .then(response => {
      if (response.status === 204) {
          console.log('Item deleted successfully'); // Log the success message
          setTasks(prevTasks => prevTasks.filter(task => task.taskID !== taskID));
      } else {
          return response.json().then(data => {
              console.error('Failed to delete task:', data.message);
          });
      }
  })
  .catch(error => {
      console.error("Fetch error:", error.message);
  });
};


return (

      <div className="App">
      <h1>Task Manager</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
      {tasks.sort((a, b) => (a.status === 'Completed' ? 1 : -1)).map(task => (
          <li key={task.taskID}>
            <div style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={task.status === 'Completed'}
                onChange={() => toggleTaskCompletion(task.taskID)}
              />
              {task.taskName}
            </div>
            <button onClick={() => deleteTask(task.taskID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    )};
  
  export default App;