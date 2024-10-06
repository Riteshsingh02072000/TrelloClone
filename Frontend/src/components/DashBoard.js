import React, { useState } from 'react';
import './DashBoard.css'; // Ensure the correct casing of the file name
import Column from './Column';
import AddTaskForm from './AddTaskForm';
import TaskDetailsModal from './TaskDetail'; // Import the TaskDetailsModal component
import { DragDropContext } from 'react-beautiful-dnd';

const initialData = {
  tasks: {
    1: { id: 1, title: 'Task One', description: 'This is task one' },
    2: { id: 2, title: 'Task Two', description: 'This is task two' },
    3: { id: 3, title: 'Task Three', description: 'This is task three' }
  },
  columns: {
    todo: {
      id: 'todo',
      title: 'To-do',
      taskIds: [1],
    },
    inprogress: {
      id: 'inprogress',
      title: 'In Progress',
      taskIds: [2],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [3],
    },
  },
  columnOrder: ['todo', 'inprogress', 'done'],
};

function Dashboard() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // State for the selected task

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If the task is dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Moving the task
    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    // If moving within the same column
    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, parseInt(draggableId));

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, parseInt(draggableId));

      const newEndColumn = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      });
    }
  };

  const handleAddTask = (newTask) => {
    // Generate a unique ID for the new task
    const newTaskId = Date.now();
    const updatedTasks = {
      ...data.tasks,
      [newTaskId]: {
        id: newTaskId,
        title: newTask.title,
        description: newTask.description,
      },
    };

    const updatedColumns = {
      ...data.columns,
      todo: {
        ...data.columns.todo,
        taskIds: [...data.columns.todo.taskIds, newTaskId],
      },
    };

    setData({
      ...data,
      tasks: updatedTasks,
      columns: updatedColumns,
    });
  };

  const handleEditTask = (task) => {
    // Implement edit functionality here
    console.log('Edit task:', task);
  };

  const handleDeleteTask = (taskId) => {
    // Remove the task from tasks and update columns
    const updatedTasks = { ...data.tasks };
    delete updatedTasks[taskId];

    const updatedColumns = { ...data.columns };
    for (let column of Object.values(updatedColumns)) {
      column.taskIds = column.taskIds.filter((id) => id !== taskId);
    }

    setData({
      ...data,
      tasks: updatedTasks,
      columns: updatedColumns,
    });
  };

  const handleViewTask = (task) => {
    // Set the selected task to display in the modal
    setSelectedTask(task);
  };

  const closeTaskDetailsModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button
          className="add-task-button"
          onClick={() => setShowAddTaskForm(true)}
        >
          Add Task
        </button>
      </div>
      {showAddTaskForm && (
        <AddTaskForm
          onClose={() => setShowAddTaskForm(false)}
          onAddTask={handleAddTask}
        />
      )}
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={closeTaskDetailsModal} />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
              );

            return (
              <Column
                key={column.id}
                columnId={column.id}
                column={column}
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onViewTask={handleViewTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;