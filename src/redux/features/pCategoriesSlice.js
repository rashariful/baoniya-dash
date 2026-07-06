import { createSlice } from "@reduxjs/toolkit";

const pCategories = createSlice({
  name: 'color',
  initialState: {
    order: null,
  },
 
});

// export const { setUser } = orderSlice.actions;
export default pCategories.reducer;
