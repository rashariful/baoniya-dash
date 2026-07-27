import { tagTypes } from "../tag-types";
import { asset } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAsset: builder.mutation({
      query: (data) => ({
        url: asset.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.asset],
    }),

    getAllAsset: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: asset.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.asset],
    }),

    getSingleAsset: builder.query({
      query: (id) => ({
        url: asset.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.asset],
    }),

    updateAsset: builder.mutation({
      query: ({ id, data }) => ({
        url: asset.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.asset],
    }),

    deleteAsset: builder.mutation({
      query: (id) => ({
        url: asset.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.asset],
    }),
  }),
});

export const {
  useCreateAssetMutation,
  useGetAllAssetQuery,
  useLazyGetAllAssetQuery,
  useGetSingleAssetQuery,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetApi;