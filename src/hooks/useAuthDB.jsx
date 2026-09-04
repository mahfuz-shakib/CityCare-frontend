import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAuthDB = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const query = useQuery({
    queryKey: ["my-info", user?.email],
    enabled: Boolean(user?.email) && !authLoading,
    queryFn: async () => {
      const response = await axiosSecure.get(`/getMyInfo/${user?.email}`);
      console.log(response.data);
      return response.data;
    },
    retry: false,
  });

  return {
    myInfo: query.data ?? null,
    loading: authLoading || query.isLoading,
    error: query.error,
  };
};

export default useAuthDB;
