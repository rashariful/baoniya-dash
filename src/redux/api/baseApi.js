import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "../tag-types";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_ROOT }),
  endpoints: () => ({}),
  tagTypes: tagTypeList,
});
