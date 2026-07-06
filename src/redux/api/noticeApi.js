import { tagTypes } from "../tag-types";
import { notice } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const noticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createNotice: builder.mutation({
      query: (data) => ({
        url: notice.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.notice],
    }),

    getAllNotice: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: notice.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.notice],
    }),

    getSingleNotice: builder.query({
      query: (id) => ({
        url: notice.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.notice],
    }),

    updateNotice: builder.mutation({
      query: ({ id, data }) => ({
        url: notice.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.notice],
    }),

    deleteNotice: builder.mutation({
      query: (id) => ({
        url: notice.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notice],
    }),

  }),
});

export const {
  useCreateNoticeMutation,
  useGetAllNoticeQuery,
  useLazyGetAllNoticeQuery,
  useGetSingleNoticeQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeApi;