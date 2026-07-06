import { createSlice } from "@reduxjs/toolkit";

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    stock: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default stockSlice.reducer;
