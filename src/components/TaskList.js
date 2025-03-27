import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask, editTask, reorderTasks } from "../redux/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskList.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");


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

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedTask);
 
    console.log("New order:", newTasks); 
    dispatch(reorderTasks(newTasks));
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
                          <option value="Work">Work</option>
                          <option value="Personal">Personal</option>
                          <option value="Urgent">Urgent</option>
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
