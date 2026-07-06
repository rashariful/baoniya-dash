import { baseApi } from "./api/baseApi";
import brandReducer from "./features/brandSlice";
import authReducer from "./features/authSlice";
import invoiceReducer from "./features/invoiceSlice";
import stockReducer from "./features/stockSlice";
import transactionReducer from "./features/transactionSlice";

export const reducer = {
  auth: authReducer,
  brand: brandReducer,
  invoice: invoiceReducer,
  stock: stockReducer,
  transaction: transactionReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
