import { tagTypes } from "../tag-types";
import { classGroup } from "./apiEndpoints"; // Ensure you have classGroup defined in your apiEndpoints
import { baseApi } from "./baseApi";

const classGroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createClassGroup: builder.mutation({
      query: (data) => ({
        url: classGroup.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.classGroup],
    }),

    getAllClassGroup: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: classGroup.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.classGroup],
    }),

    getSingleClassGroup: builder.query({
      query: (id) => ({
        url: classGroup.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.classGroup],
    }),

    updateClassGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: classGroup.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.classGroup],
    }),

    deleteClassGroup: builder.mutation({
      query: (id) => ({
        url: classGroup.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.classGroup],
    }),

  }),
});

export const {
  useCreateClassGroupMutation,
  useGetAllClassGroupQuery,
  useLazyGetAllClassGroupQuery,
  useGetSingleClassGroupQuery,
  useUpdateClassGroupMutation,
  useDeleteClassGroupMutation,
} = classGroupApi;