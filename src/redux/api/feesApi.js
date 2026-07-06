import { tagTypes } from "../tag-types";
import { fees } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const feesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createFees: builder.mutation({
      query: (data) => ({
        url: fees.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.fees],
    }),

    getAllFees: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: fees.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.fees],
    }),

    getSingleFees: builder.query({
      query: (id) => ({
        url: fees.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.fees],
    }),

    updateFees: builder.mutation({
      query: ({ id, data }) => ({
        url: fees.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.fees],
    }),

    deleteFees: builder.mutation({
      query: (id) => ({
        url: fees.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.fees],
    }),

  }),
});

export const {
  useCreateFeesMutation,
  useGetAllFeesQuery,
  useLazyGetAllFeesQuery,
  useGetSingleFeesQuery,
  useUpdateFeesMutation,
  useDeleteFeesMutation,
} = feesApi;