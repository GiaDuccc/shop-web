import axios from "axios";
import { API_ROOT } from "~/utils/constants";

const axiosAdmin = axios.create({
  baseURL: `${API_ROOT}/v1/admin`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

axiosAdmin.interceptors.request.use((config) => {

  const accessToken = localStorage.getItem("accessTokenAdmin");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

axiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log(error)
    const originalRequest = error.config;

    // Bỏ qua nếu không có response (network error, etc.)
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest?.url || "";

    // Nếu là request login hoặc refresh thì KHÔNG refresh token
    const skipUrls = ["/auth/signInAdmin", "/auth/refreshTokenAdmin"];
    if (skipUrls.some((path) => url.includes(path))) {
      return Promise.reject(error);
    }

    // Nếu lỗi là 401 + chưa retry lần nào
    if (status === 401 && !originalRequest._retry) {
      // Nếu đang refresh thì chờ đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosAdmin(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // tránh vòng lặp vô hạn
      isRefreshing = true;

      try {
        const refreshResponse = await axiosAdmin.post("/auth/refreshTokenAdmin");
        // console.log(refreshResponse)
        const newToken = refreshResponse.data.accessTokenAdmin;

        // Lưu token mới
        localStorage.setItem("accessTokenAdmin", newToken);
        // Process queue với token mới
        processQueue(null, newToken);

        // Gắn token mới rồi gọi lại request cũ
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosAdmin(originalRequest);
      } catch (refreshError: any) {
        // Process queue với lỗi
        processQueue(refreshError, null);
        
        console.error("Refresh token hết hạn → logout");
        // console.error(refreshError)
        localStorage.removeItem("accessTokenAdmin");
        
        // Chỉ redirect nếu không đang ở trang sign-in
        if (!window.location.pathname.includes("/admin/sign-in")) {
          window.location.href = "/admin/sign-in";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;