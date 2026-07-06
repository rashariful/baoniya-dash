import { tagTypes } from "../tag-types";
import { examResult } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const examResultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createExamResult: builder.mutation({
      query: (data) => ({
        url: examResult.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.examResult],
    }),

    getAllExamResult: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: examResult.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.examResult],
    }),

    getSingleExamResult: builder.query({
      query: (id) => ({
        url: examResult.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.examResult],
    }),

    updateExamResult: builder.mutation({
      query: ({ id, data }) => ({
        url: examResult.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.examResult],
    }),

    deleteExamResult: builder.mutation({
      query: (id) => ({
        url: examResult.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.examResult],
    }),

  }),
});

export const {
  useCreateExamResultMutation,
  useGetAllExamResultQuery,
  useLazyGetAllExamResultQuery,
  useGetSingleExamResultQuery,
  useUpdateExamResultMutation,
  useDeleteExamResultMutation,
} = examResultApi;