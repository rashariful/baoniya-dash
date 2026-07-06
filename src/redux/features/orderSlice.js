import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
  },
 
});

// export const { setUser } = orderSlice.actions;
export default orderSlice.reducer;
