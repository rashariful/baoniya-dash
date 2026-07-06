import { createSlice } from "@reduxjs/toolkit";
import { useGetAllProductsQuery } from "../api/products/productApi";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.data;
      state.pagination = {
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems,
      };
    },
  },
});

// Export the action from the slice
export const { setProducts } = productSlice.actions;

// Thunk action to fetch products
export const fetchProducts = (queryParams) => async (dispatch) => {
  try {
    // Fetch products using the query from the API setup
    const data = useGetAllProductsQuery(queryParams);
    dispatch(setProducts(data));
  } catch (error) {
    console.error(error);
  }
};

export default productSlice.reducer;
