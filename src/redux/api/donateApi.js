import { tagTypes } from "../tag-types";
import { donate } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const donateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createDonate: builder.mutation({
      query: (data) => ({
        url: donate.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.donate],
    }),

    getAllDonate: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: donate.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.donate],
    }),

    getSingleDonate: builder.query({
      query: (id) => ({
        url: donate.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.donate],
    }),

    updateDonate: builder.mutation({
      query: ({ id, data }) => ({
        url: donate.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.donate],
    }),

    deleteDonate: builder.mutation({
      query: (id) => ({
        url: donate.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.donate],
    }),

  }),
});

export const {
  useCreateDonateMutation,
  useGetAllDonateQuery,
  useGetSingleDonateQuery,
  useUpdateDonateMutation,
  useDeleteDonateMutation,
} = donateApi;