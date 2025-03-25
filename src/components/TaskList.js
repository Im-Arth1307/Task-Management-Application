import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, deleteTask } from "../redux/taskSlice";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks || []);// Get tasks from Redux store
  const dispatch = useDispatch();

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => dispatch(toggleTask(task.id))} // Use Redux action
          />
          {task.text}
          <button onClick={() => dispatch(deleteTask(task.id))}>❌</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
