import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
  name: "brand",
  initialState: {
    brand: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default brandSlice.reducer;
