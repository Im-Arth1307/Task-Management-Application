import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask, editTask, reorderTasks } from "../redux/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskList.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [filterStatus, setFilterStatus] = useState("all"); // "all", "completed", "incomplete"

  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  const [categories, setCategories] = useState(["Work", "Personal", "Groceries"]); // Default categories
  const [newCategory, setNewCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // Filtering category


  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
    setEditedCategory(task.category);
    setEditedDueDate(task.dueDate);
  };

  const handleSaveClick = (taskId) => {
    dispatch(editTask({ id: taskId, text: editedText, category: editedCategory, dueDate: editedDueDate }));
    setEditingTaskId(null);
  };

  // const filteredTasks = tasks
  //   .filter((task) => task.text.toLowerCase().includes(searchQuery.toLowerCase())) // Search filter
  //   .filter((task) => {
  //     if (filterStatus === "completed") return task.completed;
  //     if (filterStatus === "incomplete") return !task.completed;
  //     return true; // Show all tasks
  //   })
  //   .filter((task) => {
  //     if (categoryFilter === "all") return true;
  //     return task.category === categoryFilter;
  //   });

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
  
  return (
    <div>
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
                      className="task-item"
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
                          <button onClick={() => handleSaveClick(task.id)}>Save</button>
                        </>
                      ) : (
                        <>
                          <span>{task.text} - {task.category} (Due: {task.dueDate || "No due date"})</span>
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
