import { tagTypes } from "../tag-types";
import { teacher } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createTeacher: builder.mutation({
      query: (data) => ({
        url: teacher.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.teacher],
    }),

    getAllTeacher: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: teacher.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.teacher],
    }),

    updateTeacher: builder.mutation({
      query: ({ id, data }) => ({
        url: teacher.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.teacher],
    }),

    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: teacher.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.teacher],
    }),

  }),
});

export const {
  useCreateTeacherMutation,
  useGetAllTeacherQuery,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;