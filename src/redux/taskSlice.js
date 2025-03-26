import { createSlice } from "@reduxjs/toolkit";

// Load tasks from localStorage on startup
const loadTasks = () => {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (e) {
    console.error("Error loading tasks from localStorage", e);
    return [];
  }
};


// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const initialState = loadTasks();

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.push({ id: Date.now(), text: action.payload, completed: false });
    },
    toggleTask: (state, action) => {
      const task = state.find(task => task.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    deleteTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    editTask: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      if (task) {
        task.text = action.payload.text;
        task.category = action.payload.category;
        task.dueDate = action.payload.dueDate;
      }
    },
    reorderTasks: (state, action) => {
      console.log("Redux updated order:", action.payload);
      state.length = 0; // Clear the current state
      state.push(...action.payload); // Push new tasks
      saveTasks(state); // Save to localStorage
    }
  },
});

export const { addTask, toggleTask, deleteTask, editTask, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer;
