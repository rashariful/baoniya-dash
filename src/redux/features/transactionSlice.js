import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transaction: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default transactionSlice.reducer;
