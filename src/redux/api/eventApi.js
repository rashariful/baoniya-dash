import { tagTypes } from "../tag-types";
import { event } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createEvent: builder.mutation({
      query: (data) => ({
        url: event.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.event],
    }),

    getAllEvent: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: event.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.event],
    }),

    getSingleEvent: builder.query({
      query: (id) => ({
        url: event.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.event],
    }),

    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: event.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.event],
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({
        url: event.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.event],
    }),

  }),
});

export const {
  useCreateEventMutation,
  useGetAllEventQuery,
  useLazyGetAllEventQuery,
  useGetSingleEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;