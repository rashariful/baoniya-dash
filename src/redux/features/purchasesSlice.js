import { createSlice } from "@reduxjs/toolkit";

const purchasesSlice = createSlice({
  name: "purchases",
  initialState: {
    purchases: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default purchasesSlice.reducer;
