// src/components/Column.js
import React from 'react';
import './Column.css';
import TaskCard from './TaskCard';
import { Droppable } from 'react-beautiful-dnd';

const Column = ({ columnId, column, tasks, onEditTask, onDeleteTask, onViewTask }) => {
  return (
    <div className="column">
      <h2 className="column-title">{column.title}</h2>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onViewDetails={onViewTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
