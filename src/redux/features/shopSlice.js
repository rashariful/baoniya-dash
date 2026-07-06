import { createSlice } from "@reduxjs/toolkit";

const shop = createSlice({
  name: "shop",
  initialState: {
    invoice: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default shop.reducer;
