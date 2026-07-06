import { tagTypes } from "../tag-types";
import { section } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const sectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createSection: builder.mutation({
      query: (data) => ({
        url: section.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.section],
    }),

    getAllSection: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: section.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.section],
    }),

    getSingleSection: builder.query({
      query: (id) => ({
        url: section.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.section],
    }),

    updateSection: builder.mutation({
      query: ({ id, data }) => ({
        url: section.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.section],
    }),

    deleteSection: builder.mutation({
      query: (id) => ({
        url: section.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.section],
    }),

  }),
});

export const {
  useCreateSectionMutation,
  useGetAllSectionQuery,
  useLazyGetAllSectionQuery,
  useGetSingleSectionQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionApi;