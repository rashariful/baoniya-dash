import { tagTypes } from "../tag-types";
import { admin } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: admin.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.admin],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleAdmin: builder.query({
      query: (id) => ({
        url: admin.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.admin],
    }),

    updateAdmin: builder.mutation({
      query: (data) => ({
        url: admin.withId(data.id),
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.admin],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: admin.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useGetSingleAdminQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
