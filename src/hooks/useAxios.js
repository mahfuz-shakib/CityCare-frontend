import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://pawmart-server-api.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};
export default useAxios;
