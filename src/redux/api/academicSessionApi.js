import { tagTypes } from "../tag-types";
import { academicSession } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const academicSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createAcademicSession: builder.mutation({
      query: (data) => ({
        url: academicSession.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.academicSession],
    }),

    getAllAcademicSession: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: academicSession.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.academicSession],
    }),

    getSingleAcademicSession: builder.query({
      query: (id) => ({
        url: academicSession.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.academicSession],
    }),

    updateAcademicSession: builder.mutation({
      query: ({ id, data }) => ({
        url: academicSession.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.academicSession],
    }),

    deleteAcademicSession: builder.mutation({
      query: (id) => ({
        url: academicSession.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.academicSession],
    }),

  }),
});

export const {
  useCreateAcademicSessionMutation,
  useGetAllAcademicSessionQuery,
  useLazyGetAllAcademicSessionQuery,
  useGetSingleAcademicSessionQuery,
  useUpdateAcademicSessionMutation,
  useDeleteAcademicSessionMutation,
} = academicSessionApi;