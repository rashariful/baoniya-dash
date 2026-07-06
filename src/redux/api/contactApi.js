import { tagTypes } from "../tag-types";
import { contact } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (formData) => ({
        url: contact.all,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.contact],
    }),
    getAllContact: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: contact.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.contact],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleContact: builder.query({
      query: (id) => ({
        url: contact.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.contact],
    }),

    updateContact: builder.mutation({
      query: (data) => ({
        url: contact.withId(data.id),
        method: "PATCH",

        data: data.body,
      }),
      invalidatesTags: [tagTypes.contact],
    }),

    deleteContact: builder.mutation({
      query: (id) => ({
        url: contact.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.contact],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactQuery,
  useLazyGetAllContactQuery,
  useGetSingleContactQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;
