import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 🔹 Request interceptor
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const userDataJson = localStorage.getItem("UserData");
    const userData = userDataJson ? JSON.parse(userDataJson) : null;
    const token = userData?.access_token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    config.headers["Accept"] = "application/json";

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 🔹 Response interceptor with refresh token logic
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200 || response.status === 201) {
      return response;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;
    const message = (error.response?.data as any)?.detail;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // अगर already refresh हो रहा है तो queue में डालो
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const userDataJson = localStorage.getItem("UserData");
        const userData = userDataJson ? JSON.parse(userDataJson) : null;
        const refresh_token = userData?.refresh_token;

        if (!refresh_token) {
          throw new Error("No refresh token available");
        }

        // 🔹 Backend से नया access token लो
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/refresh-token`,
          {
            refresh_token,
          }
        );

        const { access_token: newAccessToken } = res.data;

        // localStorage और context update करो
        userData.access_token = newAccessToken;
        localStorage.setItem("UserData", JSON.stringify(userData));

        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        // retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("UserData");
        window.location.href = "/Logout";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // बाकी errors handle करो
    if ([400, 403, 404, 409, 429].includes(status || 0)) {
      let errorMessage = "An error occurred. Please try again.";
      switch (status) {
        case 400:
          errorMessage =
            message || "Bad Request. Please check the input and try again.";
          break;
        case 403:
          errorMessage =
            message ||
            "Forbidden. You do not have permission to access this resource.";
          break;
        case 404:
          errorMessage =
            message || "Not Found. The requested resource could not be found.";
          break;
        case 409:
          errorMessage =
            message || "Conflict. There was a conflict with your request.";
          break;
        case 429:
          errorMessage = message || "Too Many Requests.";
          break;
      }
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    } else if (status !== 401) {
      toast.error(
        message || "An internal server error occurred. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
