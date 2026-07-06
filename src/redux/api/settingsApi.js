import { tagTypes } from "../tag-types";
import { settings } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // CREATE
    createSettings: builder.mutation({
      query: (data) => ({
        url: settings.all,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.settings],
    }),

    // GET ALL
    getAllSettings: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: settings.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.settings],
    }),

    // GET SINGLE
    getSingleSettings: builder.query({
      query: (id) => ({
        url: settings.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.settings],
    }),

    // UPDATE
    updateSettings: builder.mutation({
      query: ({ id, data }) => ({
        url: settings.withId(id),
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.settings],
    }),

    // DELETE
    deleteSettings: builder.mutation({
      query: (id) => ({
        url: settings.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.settings],
    }),

  }),
});

export const {
  useCreateSettingsMutation,
  useGetAllSettingsQuery,
  useGetSingleSettingsQuery,
  useUpdateSettingsMutation,
  useDeleteSettingsMutation,
} = settingsApi;