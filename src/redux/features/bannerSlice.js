import { createSlice } from "@reduxjs/toolkit";

const banner = createSlice({
  name: 'banner',
  initialState: {
    banner: null,
  },
 
});

// export const { setUser } = orderSlice.actions;
export default banner.reducer;
