import { tagTypes } from "../tag-types";
import { gradeRule } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const gradeRuleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createGradeRule: builder.mutation({
      query: (data) => ({
        url: gradeRule.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.gradeRule],
    }),

    getAllGradeRule: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: gradeRule.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.gradeRule],
    }),

    getSingleGradeRule: builder.query({
      query: (id) => ({
        url: gradeRule.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.gradeRule],
    }),

    updateGradeRule: builder.mutation({
      query: ({ id, data }) => ({
        url: gradeRule.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.gradeRule],
    }),

    deleteGradeRule: builder.mutation({
      query: (id) => ({
        url: gradeRule.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.gradeRule],
    }),

  }),
});

export const {
  useCreateGradeRuleMutation,
  useGetAllGradeRuleQuery,
  useLazyGetAllGradeRuleQuery,
  useGetSingleGradeRuleQuery,
  useUpdateGradeRuleMutation,
  useDeleteGradeRuleMutation,
} = gradeRuleApi;