import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask } from "../redux/taskSlice";
import "./TaskList.css";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks || []);// Get tasks from Redux store
  const dispatch = useDispatch();

  return (
    <div className="task-container">
      <h2>My Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => dispatch(toggleTask(task.id))}
            />
            {task.text}
            <button onClick={() => dispatch(deleteTask(task.id))}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
