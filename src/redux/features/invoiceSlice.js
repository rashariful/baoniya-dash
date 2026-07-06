import { createSlice } from "@reduxjs/toolkit";

const invoice = createSlice({
  name: "invoice",
  initialState: {
    invoice: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default invoice.reducer;
