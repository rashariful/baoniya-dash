import { authKey } from "../constant/global";
import { verifyToken } from "./jwt";
import { instance as axiosInstance } from "../helpers/axios/axiosInstance";
import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from "./local-storage";
  const API_ROOT = import.meta.env.VITE_REACT_APP_ROOT;

export const storeUserInfo = ({ accessToken }) => {
  return setToLocalStorage(authKey, accessToken);
};

// console.log(storeUserInfo, "user info from auth js utils")
export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData = verifyToken(authToken);

    return {
      user: {
        ...decodedData,
        role: decodedData?.role.toLowerCase(),
      },
      token: authToken,
    };
  }
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  console.log(authKey, "authKey from local storage");

  if (authToken) {
    return !!authToken;
  }
};
export const removeUserInfo = () => {
  return removeFromLocalStorage(authKey);
};

export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: `${API_ROOT}/auth/refresh-token`, // append endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");

  // console.log(response.data, "auth fn"); // 👈 object দেখবে

  return response.data; // ✅ CORRECT
};



// export const getNewAccessToken = async () => {
//   return await axiosInstance({
//     url: "http://localhost:3000/api/v1/auth/refresh-token",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     withCredentials: true,
//   });
// };
