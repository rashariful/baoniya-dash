import { tagTypes } from "../tag-types";
import { gallery } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createGallery: builder.mutation({
      query: (formData) => ({
        url: gallery.all,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.gallery],
    }),
    getAllGallery: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: gallery.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.gallery],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleGallery: builder.query({
      query: (id) => ({
        url: gallery.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.gallery],
    }),

    updateGallery: builder.mutation({
      query: ({ id, data }) => ({
        url: gallery.withId(id),
        method: "PATCH",
        body: data, 
      }),
      invalidatesTags: [tagTypes.gallery],
    }),

    deleteGallery: builder.mutation({
      query: (id) => ({
        url: gallery.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.gallery],
    }),
  }),
});

export const {
  useCreateGalleryMutation,
  useGetAllGalleryQuery,
  useLazyGetAllGalleryQuery,
  useGetSingleGalleryQuery,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryApi;
