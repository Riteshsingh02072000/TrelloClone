// src/components/TaskDetailsModal.js
import React from 'react';
import './TaskDetail.css';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="task-details-overlay" onClick={handleOverlayClick}>
      <div className="task-details-modal">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
