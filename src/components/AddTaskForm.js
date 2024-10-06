// src/components/AddTaskForm.js
import React, { useState } from 'react';
import './AddTaskForm.css';

const AddTaskForm = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ title, description });
    onClose();
  };

  return (
    <div className="add-task-form-overlay">
      <div className="add-task-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Add Task
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
