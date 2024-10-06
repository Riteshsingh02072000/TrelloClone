// src/components/TaskCard.js
import React from 'react';
import './TaskCard.css';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, onEdit, onDelete, onViewDetails }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <div className="task-card-buttons">
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
            <button onClick={() => onViewDetails(task)}>View Details</button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
