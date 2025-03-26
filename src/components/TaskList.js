import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask, editTask } from "../redux/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskList.css";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

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

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <input type="checkbox" checked={task.completed} onChange={() => dispatch(toggleTask(task.id))} />

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
      ))}
    </ul>
  );
};

export default TaskList;
