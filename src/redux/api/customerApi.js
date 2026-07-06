import { tagTypes } from "../tag-types";
import { customer } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: customer.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.customer],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleCustomer: builder.query({
      query: (id) => ({
        url: customer.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.customer],
    }),

    updateCustomer: builder.mutation({
      query: (data) => ({
        url: customer.withId(data.id),
        method: "PATCH",
        data: data.body,
      }),
      providesTags: [tagTypes.customer],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: customer.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.customer],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
