import { tagTypes } from "../tag-types";
import { gradingScale } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const gradingScaleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createGradingScale: builder.mutation({
      query: (data) => ({
        url: gradingScale.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.gradingScale],
    }),

    getAllGradingScale: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: gradingScale.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.gradingScale],
    }),

    getSingleGradingScale: builder.query({
      query: (id) => ({
        url: gradingScale.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.gradingScale],
    }),

    updateGradingScale: builder.mutation({
      query: ({ id, data }) => ({
        url: gradingScale.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.gradingScale],
    }),

    deleteGradingScale: builder.mutation({
      query: (id) => ({
        url: gradingScale.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.gradingScale],
    }),

  }),
});

export const {
  useCreateGradingScaleMutation,
  useGetAllGradingScaleQuery,
  useLazyGetAllGradingScaleQuery,
  useGetSingleGradingScaleQuery,
  useUpdateGradingScaleMutation,
  useDeleteGradingScaleMutation,
} = gradingScaleApi;