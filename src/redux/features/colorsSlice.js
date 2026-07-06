import { createSlice } from "@reduxjs/toolkit";

const colors = createSlice({
  name: 'color',
  initialState: {
    color: null,
  },
 
});

// export const { setUser } = orderSlice.actions;
export default colors.reducer;
