import { tagTypes } from "../tag-types";
import { resultSetting } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const resultSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createResultSetting: builder.mutation({
      query: (data) => ({
        url: resultSetting.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.resultSetting],
    }),

    getAllResultSetting: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: resultSetting.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.resultSetting],
    }),

    getSingleResultSetting: builder.query({
      query: (id) => ({
        url: resultSetting.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.resultSetting],
    }),

    updateResultSetting: builder.mutation({
      query: ({ id, data }) => ({
        url: resultSetting.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.resultSetting],
    }),

    deleteResultSetting: builder.mutation({
      query: (id) => ({
        url: resultSetting.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.resultSetting],
    }),

  }),
});

export const {
  useCreateResultSettingMutation,
  useGetAllResultSettingQuery,
  useLazyGetAllResultSettingQuery,
  useGetSingleResultSettingQuery,
  useUpdateResultSettingMutation,
  useDeleteResultSettingMutation,
} = resultSettingApi;