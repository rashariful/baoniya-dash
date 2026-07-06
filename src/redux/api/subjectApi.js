import { tagTypes } from "../tag-types";
import { subject } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createSubject: builder.mutation({
      query: (data) => ({
        url: subject.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.subject],
    }),

    getAllSubject: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: subject.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.subject],
    }),

    getSingleSubject: builder.query({
      query: (id) => ({
        url: subject.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.subject],
    }),

    updateSubject: builder.mutation({
      query: ({ id, data }) => ({
        url: subject.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.subject],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: subject.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.subject],
    }),

  }),
});

export const {
  useCreateSubjectMutation,
  useGetAllSubjectQuery,
  useLazyGetAllSubjectQuery,
  useGetSingleSubjectQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;