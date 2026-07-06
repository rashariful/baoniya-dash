import { tagTypes } from "../tag-types";
import { examination } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const examinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createExamination: builder.mutation({
      query: (data) => ({
        url: examination.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.examination],
    }),

    getAllExamination: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: examination.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.examination],
    }),

    getSingleExamination: builder.query({
      query: (id) => ({
        url: examination.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.examination],
    }),

    updateExamination: builder.mutation({
      query: ({ id, data }) => ({
        url: examination.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.examination],
    }),

    deleteExamination: builder.mutation({
      query: (id) => ({
        url: examination.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.examination],
    }),

  }),
});

export const {
  useCreateExaminationMutation,
  useGetAllExaminationQuery,
  useGetSingleExaminationQuery,
  useUpdateExaminationMutation,
  useDeleteExaminationMutation,
} = examinationApi;