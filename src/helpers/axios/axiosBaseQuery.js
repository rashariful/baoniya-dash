// // import { instance as axiosInstance } from "./axiosInstance";

// // export const axiosBaseQuery =
// //   ({ baseUrl } = { baseUrl: "" }) =>
// //   async ({ url, method, data, params, headers, body }) => {
// //     const formData = data instanceof FormData ? data : body;

// //     try {
// //       const result = await axiosInstance({
// //         url: baseUrl + url,
// //         method,
// //         data: formData || data || body,
// //         params,
// //         headers: {
// //           ...headers,
// //         },
// //       });

// //       // Return exactly as you were getting data
// //       return { data: result, error: result.error || null };
// //     } catch (axiosError) {
// //       const err = axiosError;

// //       return {
// //         error: {
// //           status: err.response?.status,
// //           data: err.response?.data || err.message,
// //         },
// //       };
// //     }
// //   };



//  import { instance as axiosInstance } from "./axiosInstance";

// export const axiosBaseQuery =
//   ({ baseUrl } = { baseUrl: "" }) =>
//   async ({ url, method, data, params, headers }) => {
//     try {
//       const isFormData = data instanceof FormData;

//       const result = await axiosInstance({
//         url: baseUrl + url,
//         method,
//         data: isFormData ? data : data,
//         params,
//         headers,
//       });

//       if (result?.error) {
//         return { error: result.error };
//       }

//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError;
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };


// import { instance as axiosInstance } from "./axiosInstance";

// export const axiosBaseQuery =
//   ({ baseUrl } = { baseUrl: "" }) =>
//   async ({ url, method, data, params, headers, body }) => {
//     const formData = data instanceof FormData ? data : body;
//     try {
//       const result = await axiosInstance({
//         url: baseUrl + url,
//         method,
//         data: formData || data || body,
//         params,
//         headers: {
//           ...headers, 
//         },        
//       });
// // console.log(result, "result from axiosBaseQuery");

//       return { data: result, error: result.error || null };
//       // return { data: result?.data || result, error: null };
//     } catch (axiosError) {
//       const err = axiosError;

//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };


import { instance as axiosInstance } from "./axiosInstance"; // 👈 instance import

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers, body }) => {
    const formData = data instanceof FormData ? data : body;
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data: formData || data || body,
        params,
        headers: { ...headers },
      });

      return { data: result, error: result.error || null };

    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };