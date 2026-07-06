import { tagTypes } from "../tag-types";
import { staff } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createStaff: builder.mutation({
      query: (data) => ({
        url: staff.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.staff],
    }),

    getAllStaff: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: staff.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.staff],
    }),

    getSingleStaff: builder.query({
      query: (id) => ({
        url: staff.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.staff],
    }),

    updateStaff: builder.mutation({
      query: ({ id, data }) => ({
        url: staff.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.staff],
    }),

    deleteStaff: builder.mutation({
      query: (id) => ({
        url: staff.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.staff],
    }),

  }),
});

export const {
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useLazyGetAllStaffQuery,
  useGetSingleStaffQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;