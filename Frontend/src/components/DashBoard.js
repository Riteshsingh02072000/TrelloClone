// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import './DashBoard.css';
import Column from './Column';
import AddTaskForm from './AddTaskForm.js';
import TaskDetailsModal from './TaskDetail.js';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState({
    tasks: {},
    columns: {
      todo: { id: 'todo', title: 'To-do', taskIds: [] },
      inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
      done: { id: 'done', title: 'Done', taskIds: [] },
    },
    columnOrder: ['todo', 'inprogress', 'done'],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('https://trelloclone-w4nv.onrender.com/api/tasks', {
          headers: {
            'x-auth-token': token,
          },
        });

        // Transform tasks into the expected data format
        const tasks = {};
        res.data.forEach((task) => {
          tasks[task._id] = {
            id: task._id,
            title: task.title,
            description: task.description,
          };
        });

        const columns = {
          todo: { id: 'todo', title: 'To-do', taskIds: [] },
          inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
          done: { id: 'done', title: 'Done', taskIds: [] },
        };

        res.data.forEach((task) => {
          columns[task.status].taskIds.push(task._id);
        });

        setData({
          tasks,
          columns,
          columnOrder: ['todo', 'inprogress', 'done'],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
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

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);

      const newEndColumn = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      };

      setData(newData);

      // Update task status in backend
      const token = localStorage.getItem('token');
      try {
        await axios.put(
          `https://trelloclone-w4nv.onrender.com/api/tasks/${draggableId}`,
          { status: destination.droppableId },
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Function to handle adding a new task
  const handleAddTask = async (title, description) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'https://trelloclone-w4nv.onrender.com/api/tasks',
        { title, description, status: 'todo' },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      const newTask = res.data;

      setData((prevData) => {
        const newTasks = {
          ...prevData.tasks,
          [newTask._id]: {
            id: newTask._id,
            title: newTask.title,
            description: newTask.description,
          },
        };

        const newTaskIds = [newTask._id, ...prevData.columns['todo'].taskIds];

        const newColumns = {
          ...prevData.columns,
          todo: {
            ...prevData.columns['todo'],
            taskIds: newTaskIds,
          },
        };

        return {
          ...prevData,
          tasks: newTasks,
          columns: newColumns,
        };
      });

      setShowAddTaskForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle editing a task
  const handleEditTask = async (taskId, updatedTitle, updatedDescription) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `https://trelloclone-w4nv.onrender.com/api/tasks/${taskId}`,
        { title: updatedTitle, description: updatedDescription },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      const updatedTask = res.data;

      setData((prevData) => ({
        ...prevData,
        tasks: {
          ...prevData.tasks,
          [updatedTask._id]: {
            id: updatedTask._id,
            title: updatedTask.title,
            description: updatedTask.description,
          },
        },
      }));

      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://trelloclone-w4nv.onrender.com/api/tasks/${taskId}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setData((prevData) => {
        // Remove task from tasks object
        const newTasks = { ...prevData.tasks };
        delete newTasks[taskId];

        // Remove taskId from the column it belongs to
        const newColumns = { ...prevData.columns };
        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(
            (id) => id !== taskId
          );
        });

        return {
          ...prevData,
          tasks: newTasks,
          columns: newColumns,
        };
      });

      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle viewing a task's details
  const handleViewTask = (taskId) => {
    const task = data.tasks[taskId];
    setSelectedTask(task);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Task Management</h2>
        <div className="dashboard-actions">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={() => setShowAddTaskForm(true)}>Add Task</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
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
      {showAddTaskForm && (
        <AddTaskForm
          onAddTask={handleAddTask}
          onClose={() => setShowAddTaskForm(false)}
        />
      )}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default Dashboard;






// src/components/Dashboard.js
// import React, { useState, useEffect } from 'react';
// import './DashBoard.css';
// import Column from './Column';
// import AddTaskForm from './AddTaskForm.js';
// import TaskDetailsModal from './TaskDetail.js';
// import { DragDropContext } from 'react-beautiful-dnd';
// import axios from 'axios';

// function Dashboard() {
//   const [data, setData] = useState({
//     tasks: {},
//     columns: {
//       todo: { id: 'todo', title: 'To-do', taskIds: [] },
//       inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
//       done: { id: 'done', title: 'Done', taskIds: [] },
//     },
//     columnOrder: ['todo', 'inprogress', 'done'],
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddTaskForm, setShowAddTaskForm] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);

//   // Fetch tasks on component mount
//   useEffect(() => {
//     const fetchTasks = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get('https://trelloclone-w4nv.onrender.com/api/tasks', {
//           headers: {
//             'x-auth-token': token,
//           },
//         });

//         // Transform tasks into the expected data format
//         const tasks = {};
//         res.data.forEach((task) => {
//           tasks[task._id] = {
//             id: task._id,
//             title: task.title,
//             description: task.description,
//           };
//         });

//         const columns = {
//           todo: { id: 'todo', title: 'To-do', taskIds: [] },
//           inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
//           done: { id: 'done', title: 'Done', taskIds: [] },
//         };

//         res.data.forEach((task) => {
//           columns[task.status].taskIds.push(task._id);
//         });

//         setData({
//           tasks,
//           columns,
//           columnOrder: ['todo', 'inprogress', 'done'],
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const onDragEnd = async (result) => {
//     const { destination, source, draggableId } = result;

//     // If no destination, do nothing
//     if (!destination) return;

//     // If the task is dropped in the same place, do nothing
//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     )
//       return;

//     // Moving the task
//     const startColumn = data.columns[source.droppableId];
//     const endColumn = data.columns[destination.droppableId];

//     if (startColumn === endColumn) {
//       const newTaskIds = Array.from(startColumn.taskIds);
//       newTaskIds.splice(source.index, 1);
//       newTaskIds.splice(destination.index, 0, draggableId);

//       const newColumn = {
//         ...startColumn,
//         taskIds: newTaskIds,
//       };

//       const newData = {
//         ...data,
//         columns: {
//           ...data.columns,
//           [newColumn.id]: newColumn,
//         },
//       };

//       setData(newData);
//     } else {
//       const startTaskIds = Array.from(startColumn.taskIds);
//       startTaskIds.splice(source.index, 1);

//       const newStartColumn = {
//         ...startColumn,
//         taskIds: startTaskIds,
//       };

//       const endTaskIds = Array.from(endColumn.taskIds);
//       endTaskIds.splice(destination.index, 0, draggableId);

//       const newEndColumn = {
//         ...endColumn,
//         taskIds: endTaskIds,
//       };

//       const newData = {
//         ...data,
//         columns: {
//           ...data.columns,
//           [newStartColumn.id]: newStartColumn,
//           [newEndColumn.id]: newEndColumn,
//         },
//       };

//       setData(newData);

//       // Update task status in backend
//       const token = localStorage.getItem('token');
//       try {
//         await axios.put(
//           `https://trelloclone-w4nv.onrender.com/api/tasks/${draggableId}`,
//           { status: destination.droppableId },
//           {
//             headers: {
//               'x-auth-token': token,
//             },
//           }
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   // Implement handleAddTask, handleEditTask, handleDeleteTask, handleViewTask as before
//   // Ensure they interact with the backend accordingly

//   return (
//     <div className="dashboard">
//       {/* ...rest of your component */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="columns-container">
//           {data.columnOrder.map((columnId) => {
//             const column = data.columns[columnId];
//             const tasks = column.taskIds
//               .map((taskId) => data.tasks[taskId])
//               .filter((task) =>
//                 task.title.toLowerCase().includes(searchTerm.toLowerCase())
//               );

//             return (
//               <Column
//                 key={column.id}
//                 columnId={column.id}
//                 column={column}
//                 tasks={tasks}
//                 onEditTask={handleEditTask}
//                 onDeleteTask={handleDeleteTask}
//                 onViewTask={handleViewTask}
//               />
//             );
//           })}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }

// export default Dashboard;
