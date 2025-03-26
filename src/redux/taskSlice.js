import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: 1, text: "Example Task", completed: false,  category: "Work", dueDate: "2025-04-01" }
];

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
  },
});

export const { addTask, toggleTask, deleteTask, editTask } = taskSlice.actions;
export default taskSlice.reducer;
