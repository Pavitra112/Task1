import React, { useState } from 'react';

const Task = ({ task, onEdit, onDelete, onAddChild }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [addch, setaddch] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [child, setChild] = useState('');

  const handleEdit = () => {
    onEdit(task.id, editedText);
    setIsEditing(false);
  };

  const handleChild = () => {
    onAddChild(task.id, child);
    setaddch(false);
    setChild('');
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

 

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
        </div>
      ) : addch ? (
        <div>
          <input
            type="text"
            value={child}
            onChange={(e) => setChild(e.target.value)}
          />
          <button onClick={handleChild}>Add Child</button>
        </div>
      ) : (
        <div>
          {task.text}
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => setaddch(true)}>Add Child</button>
        </div>
      )}
      <ul>
        {task.children.map((childTask) => (
          <li key={childTask.id}>
            <Task
              key={childTask.id}
              task={childTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          </li>
       ) )}
      </ul>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = (parentId, text) => {
    const newTaskObj = { id: Date.now(), text, children: [] };
    if (parentId === null) {
      setTasks([...tasks, newTaskObj]);
    } else {
      updateTasks([...tasks], parentId, (task) => task.children.push(newTaskObj));
    }
    setNewTask('');
  };

  const updateTasks = (tasks, id, updateFunction) => {
    for (const task of tasks) {
      if (task.id === id) {
        updateFunction(task);
        return;
      } else if (task.children) {
        updateTasks(task.children, id, updateFunction);
      }
    }
  };

  const editTask = (taskId, newText) => {
    updateTasks([...tasks], taskId, (task) => (task.text = newText));
    setTasks([...tasks]);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = deleteTaskRecursive([...tasks], taskId);
    setTasks(updatedTasks);
  };

  const deleteTaskRecursive = (tasks, taskId) => {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        tasks.splice(i, 1);
        return tasks;
      } else if (tasks[i].children) {
        deleteTaskRecursive(tasks[i].children, taskId);
      }
    }
    return tasks;
  };

  const addChild = (parentId, childText) => {
    addTask(parentId, childText);
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Enter a task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={() => addTask(null, newTask)}>Add</button>

      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onEdit={editTask}
          onDelete={deleteTask}
          onAddChild={addChild}
        />
       ) )}
    </div>
  );
};

export default TaskList;
