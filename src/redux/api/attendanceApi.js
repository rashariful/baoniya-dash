import { tagTypes } from "../tag-types";
import { attendance } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createAttendance: builder.mutation({
      query: (formData) => ({
        url: attendance.all,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.attendance],
    }),

    getAllAttendance: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: attendance.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.attendance],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleAttendance: builder.query({
      query: (id) => ({
        url: attendance.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.attendance],
    }),

    updateAttendance: builder.mutation({
      query: ({ id, data }) => ({
        url: attendance.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.attendance],
    }),

    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: attendance.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.attendance],
    }),

  }),
});

export const {
  useCreateAttendanceMutation,
  useGetAllAttendanceQuery,
  useLazyGetAllAttendanceQuery,
  useGetSingleAttendanceQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;