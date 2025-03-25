import React from "react";

const TaskItem = ({ task }) => {
  return (
    <div>
      <input type="checkbox" checked={task.completed} readOnly />
      <span>{task.title}</span>
    </div>
  );
};

export default TaskItem;
