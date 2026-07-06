import { tagTypes } from "../tag-types";
import { admission } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const admissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createAdmission: builder.mutation({
      query: (formData) => ({
        url: admission.all,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.admission],
    }),

    getAllAdmission: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: admission.all,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.admission],
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleAdmission: builder.query({
      query: (id) => ({
        url: admission.withId(id),
        method: "GET",
      }),
      providesTags: [tagTypes.admission],
    }),

    updateAdmission: builder.mutation({
      query: ({ id, data }) => ({
        url: admission.withId(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.admission],
    }),

    deleteAdmission: builder.mutation({
      query: (id) => ({
        url: admission.withId(id),
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admission],
    }),

  }),
});

export const {
  useCreateAdmissionMutation,
  useGetAllAdmissionQuery,
  useLazyGetAllAdmissionQuery,
  useGetSingleAdmissionQuery,
  useUpdateAdmissionMutation,
  useDeleteAdmissionMutation,
} = admissionApi;