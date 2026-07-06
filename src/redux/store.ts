// src/redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { reducer as sliceReducers } from "./rootReducer";
import { baseApi } from "./api/baseApi";

const rootReducer = combineReducers(sliceReducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { reducer } from "./rootReducer";
// import { baseApi } from "./api/baseApi";

// export const store = configureStore({
//   reducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(baseApi.middleware),
// });

// export default store;

