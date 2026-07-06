import { authKey } from "../constant/global";

export const getFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const setAccessToken = (token) => {
  setToLocalStorage(authKey, token);
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
