// src/redux/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload || {};

      state.user = {
        ...user,
        name: user?.name,
        email: user?.email,
        role: user?.role?.toLowerCase(),
      };
      state.token = token;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;

// Default export - এটা খুব জরুরি
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   token: null,
// };
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//   },
// });

// export const { setUser, logout } = authSlice.actions;

// export default authSlice.reducer;

// export const useCurrentToken = (state) => state.auth.token;
// export const selectCurrentUser = (state) => state.auth.user;
