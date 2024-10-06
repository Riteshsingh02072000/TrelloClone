import React, { useState } from 'react';
import './DashBoard.css';
// import Navbar from './components/Navbar';
// import SearchBar from './components/SearchBar';
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';

const initialData = {
  tasks: {
    1: { id: 1, title: 'Task One', description: 'This is task one' },
    2: { id: 2, title: 'Task Two', description: 'This is task two' },
    3: { id: 3, title: 'Task Three', description: 'This is task three' },
    4: { id: 4, title: 'Task 4', description: 'This is task three' },
    5: { id: 5, title: 'Task 5', description: 'This is task three' },
    6: { id: 6, title: 'Task Three', description: 'This is task three' },
    7: { id: 7, title: 'Task 4', description: 'This is task three' },
    8: { id: 8, title: 'Task 5', description: 'This is task three' },
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'To-do',
      taskIds: [1,2,3,4,5,6,7,8],
    },
    'inprogress': {
      id: 'inprogress',
      title: 'In Progress',
      taskIds: [],
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['todo', 'inprogress', 'done'],
};

function Dashboard() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="Dashboard">
      {/* <Navbar /> */}
      {/* <SearchBar onSearch={handleSearch} /> */}
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
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;