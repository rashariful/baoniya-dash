import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    supplier: null,
  },
});

// export const { setUser } = orderSlice.actions;
export default supplierSlice.reducer;
