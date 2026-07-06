import { tagTypes } from "../tag-types";
import { student } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createStudent: builder.mutation({
      query: (data) => ({
        url: student.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.student],
    }),

    getAllStudent: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: student.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.student],
    }),

    updateStudent: builder.mutation({
      query: ({ id, data }) => ({
        url: student.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.student],
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: student.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.student],
    }),

  }),
});

export const {
  useCreateStudentMutation,
  useGetAllStudentQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;