import { tagTypes } from "../tag-types";
import { classes } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createClasses: builder.mutation({
      query: (data) => ({
        url: classes.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.classes],
    }),

    getAllClasses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: classes.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.classes],
    }),

    getSingleClasses: builder.query({
      query: (id) => ({
        url: classes.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.classes],
    }),

    updateClasses: builder.mutation({
      query: ({ id, data }) => ({
        url: classes.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.classes],
    }),

    deleteClasses: builder.mutation({
      query: (id) => ({
        url: classes.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.classes],
    }),

  }),
});

export const {
  useCreateClassesMutation,
  useGetAllClassesQuery,
  useLazyGetAllClassesQuery,
  useGetSingleClassesQuery,
  useUpdateClassesMutation,
  useDeleteClassesMutation,
} = classesApi;