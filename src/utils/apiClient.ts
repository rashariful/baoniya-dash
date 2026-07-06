// src/utils/apiClient.ts

const API_ROOT: string = import.meta.env.VITE_REACT_APP_ROOT;

interface ApiFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiFetch = async (
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<Response> => {
  let token: string | null = localStorage.getItem("accessToken");

  const makeRequest = async (token: string | null): Promise<Response> => {
    return fetch(`${API_ROOT}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  };

  let response = await makeRequest(token);

  // Access token expired
  if (response.status === 401) {
    const refreshRes = await fetch(`${API_ROOT}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    const refreshData = await refreshRes.json();

    token = refreshData?.data?.accessToken;

    if (token) {
      localStorage.setItem("accessToken", token);
      response = await makeRequest(token);
    }
  }

  return response;
};