// import axios from "axios";
// import { getFromLocalStorage } from "../../utils/local-storage";
// import { authKey } from "../../constant/global";

// const instance = axios.create();
// instance.defaults.headers.post["Content-Type"] = "application/json";
// instance.defaults.headers["Accept"] = "application/json";
// instance.defaults.timeout = 30000;

// // ✅ Request Interceptor
// instance.interceptors.request.use(
//   function (config) {
//     const accessToken = getFromLocalStorage(authKey);

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     }

//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// // ✅ Response Interceptor
// instance.interceptors.response.use(
//   function (response) {
//     const responseObject = {
//       data: response?.data?.data,
//       meta: response?.data?.meta,
//     };
//     return responseObject;
//   },
//   async function (error) {
//     const responseObject = {
//       statusCode: error?.response?.data?.statusCode || 500,
//       message: error?.response?.data?.message || "Something went wrong!",
//       errorMessages: error?.response?.data?.message,
//       errorSources: error?.response?.data?.errorSources,
//     };

//     return { error: responseObject };
//   }
// );

// export { instance };


import axios from "axios";
import { 
  getFromLocalStorage,  
  setToLocalStorage ,
  removeFromLocalStorage 
} from "../../utils/local-storage";
import { authKey } from "../../constant/global";

const instance = axios.create({
  withCredentials: true, // 👈 এটা জরুরি
});

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 30000;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => ({
    data: response?.data?.data,
    meta: response?.data?.meta,
  }),
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_REACT_APP_ROOT}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res?.data?.data?.accessToken;
        setToLocalStorage(authKey, newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        removeFromLocalStorage(authKey);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 401 ছাড়া অন্য error
    return {
      error: {
        statusCode: error?.response?.data?.statusCode || 500,
        message: error?.response?.data?.message || "Something went wrong!",
        errorMessages: error?.response?.data?.message,
        errorSources: error?.response?.data?.errorSources,
      },
    };
  }
);

export { instance };