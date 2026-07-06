import { tagTypes } from "../tag-types";
import { auth } from "./apiEndpoints";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: auth.login,
        method: "POST",
        body: data,
      }),
      // transformResponse: (response) => response,
      invalidatesTags: [tagTypes.user],
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: auth.forgotPassword,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: auth.changePassword,
        method: "POST",
        data,
      }),
    }),
    verifyChangePasswordOtp: builder.mutation({
      query: (data) => ({
        url: auth.changePassword + "/otp",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: auth.resetPassword,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useVerifyChangePasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
