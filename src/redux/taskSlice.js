import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: 1, text: "Example Task", completed: false }
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
    }
  },
});

export const { addTask, toggleTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
