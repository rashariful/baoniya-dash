import { tagTypes } from "../tag-types";
import { parents } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const parentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createParents: builder.mutation({
      query: (data) => ({
        url: parents.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.parents],
    }),

    getAllParents: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: parents.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.parents],
    }),

    getSingleParents: builder.query({
      query: (id) => ({
        url: parents.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.parents],
    }),

    updateParents: builder.mutation({
      query: ({ id, data }) => ({
        url: parents.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.parents],
    }),

    deleteParents: builder.mutation({
      query: (id) => ({
        url: parents.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.parents],
    }),

  }),
});

export const {
  useCreateParentsMutation,
  useGetAllParentsQuery,
  useGetSingleParentsQuery,
  useUpdateParentsMutation,
  useDeleteParentsMutation,
} = parentsApi;