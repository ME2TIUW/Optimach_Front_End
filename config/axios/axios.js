import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SELF_HOST}`, 
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); 
    console.log("access token =", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor: Handles 401 Unauthorized for Token Refresh ---
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Is it a 401 Unauthorized not already retried?
    if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
        handleLogoutUser();
        return Promise.reject(error);
      }

    try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_SELF_HOST}/auth/refresh`,
          { refresh_token: storedRefreshToken },
          { withCredentials: true } 
        );

        const newAccessToken = refreshResponse.data.access_token;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
    } catch (refreshError) {
        handleLogoutUser();
        return Promise.reject(refreshError);
    }
}

    console.warn("Axios Interceptor: Re-throwing error to component:", error);
    return Promise.reject(error);
  }
);

export const handleLogoutUser = async () => {
  try {
    await apiClient.post("/auth/logout");

  } catch (error) {
    console.error("Logout server error:", error);
  } finally{
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    
    window.location.href = "/login"; 
  }
}

export default apiClient;
