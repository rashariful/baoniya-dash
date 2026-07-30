import { tagTypes } from "../tag-types";
import { finalResult } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const finalResultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFinalResult: builder.mutation({
      query: (data) => ({
        url: finalResult.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.finalResult],
    }),
generateBulkFinalResult: builder.mutation({
  query: (data) => ({
    url: `${finalResult.all}/generate-bulk`, // আপনার রাউটের সাথে মিলিয়ে নেবেন
    method: "POST",
    data,
  }),
  invalidatesTags: [tagTypes.finalResult],
}),
    // New: Generate Final Result mutation added here
    generateFinalResult: builder.mutation({
      query: (data) => ({
        url: `${finalResult.all}/generate`, // router.post("/generate", ...) er sathe match korar jonno
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.finalResult],
    }),

    getAllFinalResult: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: finalResult.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.finalResult],
    }),

    getSingleFinalResult: builder.query({
      query: (id) => ({
        url: finalResult.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.finalResult],
    }),

    updateFinalResult: builder.mutation({
      query: ({ id, data }) => ({
        url: finalResult.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.finalResult],
    }),

    deleteFinalResult: builder.mutation({
      query: (id) => ({
        url: finalResult.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.finalResult],
    }),
  }),
});

export const {
  useCreateFinalResultMutation,
  useGenerateFinalResultMutation, // Exported new hook
  useGetAllFinalResultQuery,
  useLazyGetAllFinalResultQuery,
  useGetSingleFinalResultQuery,
  useUpdateFinalResultMutation,
  useDeleteFinalResultMutation,
  useGenerateBulkFinalResultMutation
} = finalResultApi;