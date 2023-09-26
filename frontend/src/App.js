import React from 'react';
import './App.css';

function App() {
  const tasks = [
    { id: 1, title: 'Learn Docker', completed: false },
    { id: 2, title: 'Complete Assignment', completed: true },
  ];

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <form>
        <input type="text" placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} />
            {task.title} {task.completed ? '(Completed)' : ''}
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

