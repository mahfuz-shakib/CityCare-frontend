import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";
import { auth } from "../firebase/firebase.config";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor — always gets a fresh token at call time
    const requestInterceptor = axiosInstance.interceptors.request.use(async (config) => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor — handle 401/403
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logOut()
            .then(() => console.log("Logged out due to auth error."))
            .catch(console.error);
          navigate("/login");
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
