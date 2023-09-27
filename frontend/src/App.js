import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks(prevTasks => [...prevTasks, { id: Date.now(), title: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const removeTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return {...task, completed: !task.completed}; 
      }
      return task;
    }));
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
        {tasks.sort((a, b) => a.completed - b.completed).map(task => (
          <li key={task.id} className={task.completed ? 'completed-task' : ''}>
            <input 
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {task.title}
            <button onClick={() => removeTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

