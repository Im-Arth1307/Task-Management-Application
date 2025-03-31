import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask, editTask, reorderTasks } from "../redux/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskList.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [filterStatus, setFilterStatus] = useState("all"); // "all", "completed", "incomplete"

  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedPriority, setEditedPriority] = useState("medium");

  const [categories, setCategories] = useState(["Work", "Personal", "Groceries"]); // Default categories
  const [priorities, setPriorities] = useState(["high", "medium", "low"]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // Filtering category


  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
    setEditedCategory(task.category);
    setEditedDueDate(task.dueDate);
    setEditedPriority(task.priority || "medium");
  };

  const handleSaveClick = (taskId) => {
    dispatch(editTask({ 
      id: taskId, 
      text: editedText, 
      category: editedCategory, 
      dueDate: editedDueDate,
      priority: editedPriority === "medium" ? null : editedPriority
    }));
    setEditingTaskId(null);
  };

  const filteredTasks = tasks
  .filter((task) => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
  .filter((task) => {
    if (filterStatus === "completed") return task.completed;
    if (filterStatus === "incomplete") return !task.completed;
    return true;
  })
  .filter((task) => {
    if (categoryFilter === "all") return true;
    return task.category === categoryFilter;
  })
  .filter((task) => {
    if (priorityFilter === "all") return true;
    return task.priority === priorityFilter;
  })
  .sort((a, b) => {
    // Sort by priority (high -> medium -> low)
    if (a.priority === b.priority) return 0;
    if (a.priority === "high") return -1;
    if (b.priority === "high") return 1;
    if (a.priority === "medium") return -1;
    if (b.priority === "medium") return 1;
    return 0;
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedTask);
 
    console.log("New order:", newTasks); 
    dispatch(reorderTasks(newTasks));
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter((cat) => cat !== categoryToDelete));

    // Update tasks that belong to the deleted category
    tasks.forEach((task) => {
      if (task.category === categoryToDelete) {
        dispatch(editTask({ id: task.id, text: task.text, category: "", dueDate: task.dueDate }));
      }
    });
  };

  const checkDueDates = () => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    tasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        
        // Check if due today (any time today)
        if (dueDate >= now && dueDate <= tomorrowStart) {
          toast.warning(`Task "${task.text}" is due today!`, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
          });
        }
        // Check if due tomorrow (any time tomorrow)
        else if (dueDate >= tomorrowStart && dueDate <= tomorrowEnd) {
          toast.info(`Task "${task.text}" is due tomorrow`, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
          });
        }
      }
    });
  };

  useEffect(() => {
    // Check due dates immediately when component mounts
    checkDueDates();
    
    // Set up interval to check every hour
    const interval = setInterval(checkDueDates, 3600000); // 1 hour in milliseconds
    
    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, [tasks]); // Add tasks as a dependency to re-run when tasks change

  return (
    <div>
      <ToastContainer />
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Filter Controls */}
      <div className="filter-controls">
        {/* Complete/Incomplete Filter */}
        <div className="filter-container">
          <label>Filter: </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-container">
          <label>Priority: </label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-container">
          <label>Category: </label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Management Controls */}
      <div className="category-management">
        {/* Add new category */}
        <div className="filter-container">
          <label>Add new category:</label>
          <input
            type="text"
            placeholder="Enter new category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onBlur={() => {
              if (newCategory && !categories.includes(newCategory)) {
                setCategories([...categories, newCategory]);
                setNewCategory("");
              }
            }}
          />
        </div>

        {/* Delete Category */}
        <div className="filter-container">
          <label>Delete Category: </label>
          <select onChange={(e) => handleDeleteCategory(e.target.value)}>
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} className="task-list">
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task-item ${task.priority}-priority`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch(toggleTask(task.id))}
                      />

                      {editingTaskId === task.id ? (
                        <>
                          <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                          <select value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <input type="date" value={editedDueDate} onChange={(e) => setEditedDueDate(e.target.value)} />
                          <select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)}>
                            {priorities.map((priority) => (
                              <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                            ))}
                          </select>
                          <button onClick={() => handleSaveClick(task.id)}>Save</button>
                        </>
                      ) : (
                        <>
                          <span>{task.text} - {task.category} (Due: {task.dueDate || "No due date"}) - Priority: {(task.priority || "medium").charAt(0).toUpperCase() + (task.priority || "medium").slice(1)}</span>
                          <button onClick={() => handleEditClick(task)}>Edit</button>
                        </>
                      )}

                      <button onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
