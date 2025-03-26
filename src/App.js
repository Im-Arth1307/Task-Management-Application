import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { useDispatch } from "react-redux";
import { addTask } from "./redux/taskSlice";
import "./App.css";


const App = () => {
  const [taskText, setTaskText] = useState("");
  const dispatch = useDispatch();

  const handleAddTask = () => {
    if (taskText.trim() !== "") {
      dispatch(addTask(taskText));
      setTaskText("");
    }
  };

  return (
    <div className="app-container">
      <h1>Task Manager App</h1>

      <div className="task-input-container">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="add-task-button" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <TaskList />
    </div>
  );
};

export default App;