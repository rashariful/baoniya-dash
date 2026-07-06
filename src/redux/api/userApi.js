import { tagTypes } from "../tag-types";
import { user } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (data) => ({
        url: user.admin,
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.admin, tagTypes.user],
    }),
    createVendor: builder.mutation({
      query: (data) => ({
        url: user.vendor,
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.vendor, tagTypes.user],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: user.customer,
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.customer, tagTypes.user],
    }),
    updateContactNo: builder.mutation({
      query: (data) => ({
        url: "/users/update-contact-no",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    myInfo: builder.query({
      query: () => ({
        url: user.myInfo,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useCreateVendorMutation,
  useCreateCustomerMutation,
  useUpdateContactNoMutation,
  useMyInfoQuery,
} = userApi;
