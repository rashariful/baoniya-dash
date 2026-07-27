import { tagTypes } from "../tag-types";
import { library } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLibrary: builder.mutation({
      query: (data) => ({
        url: library.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.library],
    }),

    getAllLibrary: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: library.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.library],
    }),

    getSingleLibrary: builder.query({
      query: (id) => ({
        url: library.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.library],
    }),

    updateLibrary: builder.mutation({
      query: ({ id, data }) => ({
        url: library.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.library],
    }),

    deleteLibrary: builder.mutation({
      query: (id) => ({
        url: library.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.library],
    }),
  }),
});

export const {
  useCreateLibraryMutation,
  useGetAllLibraryQuery,
  useLazyGetAllLibraryQuery,
  useGetSingleLibraryQuery,
  useUpdateLibraryMutation,
  useDeleteLibraryMutation,
} = libraryApi;