import { tagTypes } from "../tag-types";
import { exam } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createExam: builder.mutation({
      query: (data) => ({
        url: exam.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.exam],
    }),

    getAllExam: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => params.append(item.name, item.value));
        }

        return {
          url: exam.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.exam],
    }),

    getSingleExam: builder.query({
      query: (id) => ({
        url: exam.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.exam],
    }),

    updateExam: builder.mutation({
      query: ({ id, data }) => ({
        url: exam.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.exam],
    }),

    deleteExam: builder.mutation({
      query: (id) => ({
        url: exam.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.exam],
    }),

  }),
});

export const {
  useCreateExamMutation,
  useGetAllExamQuery,
  useLazyGetAllExamQuery,
  useGetSingleExamQuery,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi;