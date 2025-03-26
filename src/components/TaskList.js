import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask } from "../redux/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskList.css";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  return (
    <ul className="task-list">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="task-item"
          >
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => dispatch(toggleTask(task.id))} 
            />
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
            <button className="delete-btn" onClick={() => dispatch(deleteTask(task.id))}>
              ❌
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
  };

export default TaskList;
