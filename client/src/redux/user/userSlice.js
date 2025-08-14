import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if available
const storedUser = localStorage.getItem("currentUser");

const initialState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      // If API response contains "user", store only that object
      const payload = action.payload.user || action.payload;
      state.currentUser = payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("currentUser", JSON.stringify(payload));
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      // Same flattening logic here
      const payload = action.payload.user || action.payload;
      state.currentUser = payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("currentUser", JSON.stringify(payload));
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserStart: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} = userSlice.actions;

export default userSlice.reducer;
