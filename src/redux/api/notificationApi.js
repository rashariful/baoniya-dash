import { tagTypes } from "../tag-types";
import { notification } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Create
    // =========================
    createNotification: builder.mutation({
      query: (formData) => ({
        url: notification.all,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.notification],
    }),

    // =========================
    // Get All
    // =========================
    getAllNotification: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: notification.all,
          method: "GET",
          params,
        };
      },

      providesTags: [tagTypes.notification],

      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    // =========================
    // Get Single
    // =========================
    getSingleNotification: builder.query({
      query: (id) => ({
        url: notification.withId(id),
        method: "GET",
      }),

      providesTags: [tagTypes.notification],
    }),

    // =========================
    // Update
    // =========================
    updateNotification: builder.mutation({
      query: ({ id, data }) => ({
        url: notification.withId(id),
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: [tagTypes.notification],
    }),

    // =========================
    // Delete
    // =========================
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: notification.withId(id),
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.notification],
    }),

    // =====================================
    // Student Recipients
    // GET /notifications/recipients/students
    // =====================================
    getStudentRecipients: builder.query({
      query: () => ({
        url: `${notification.all}/recipients/students`,
        method: "GET",
      }),

      transformResponse: (response) => response.data,
    }),

    // =====================================
    // Teacher Recipients
    // GET /notifications/recipients/teachers
    // =====================================
    getTeacherRecipients: builder.query({
      query: () => ({
        url: `${notification.all}/recipients/teachers`,
        method: "GET",
      }),

      transformResponse: (response) => response.data,
    }),

    // =====================================
    // Broadcast To All
    // POST /notifications/broadcast/all
    // =====================================
    broadcastToAll: builder.mutation({
      query: (body) => ({
        url: `${notification.all}/broadcast/all`,
        method: "POST",
        data: body,
      }),

      invalidatesTags: [tagTypes.notification],
    }),

    // =====================================
    // Broadcast To Selected
    // POST /notifications/broadcast/selected
    // =====================================
    broadcastToSelected: builder.mutation({
      query: (body) => ({
        url: `${notification.all}/broadcast/selected`,
        method: "POST",
        data: body,
      }),

      invalidatesTags: [tagTypes.notification],
    }),

    // =====================================
    // Broadcast Due Fees
    // POST /notifications/broadcast/due-fees
    // =====================================
    broadcastToDueFees: builder.mutation({
      query: (body) => ({
        url: `${notification.all}/broadcast/due-fees`,
        method: "POST",
        data: body,
      }),

      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetAllNotificationQuery,
  useLazyGetAllNotificationQuery,
  useGetSingleNotificationQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,

  // NEW
  useGetStudentRecipientsQuery,
  useLazyGetStudentRecipientsQuery,

  useGetTeacherRecipientsQuery,
  useLazyGetTeacherRecipientsQuery,

  useBroadcastToAllMutation,
  useBroadcastToSelectedMutation,
  useBroadcastToDueFeesMutation,
} = notificationApi;
