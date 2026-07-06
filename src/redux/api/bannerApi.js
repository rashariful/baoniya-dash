import { tagTypes } from "../tag-types";
import { banner } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createBanner: builder.mutation({
      query: (formData) => ({
        url: banner.all,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.banner],
    }),
    getAllBanner: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: banner.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.banner],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleBanner: builder.query({
      query: (id) => ({
        url: banner.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.banner],
    }),

    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: banner.withId(id),
        method: "PATCH",
        body: data, 
      }),
      invalidatesTags: [tagTypes.banner],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: banner.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.banner],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useGetAllBannerQuery,
  useLazyGetAllBannerQuery,
  useGetSingleBannerQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
