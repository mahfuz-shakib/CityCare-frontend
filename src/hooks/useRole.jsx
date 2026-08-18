import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = "citizen", isLoading: roleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/role");
      return res.data?.role || "citizen";
    },
    // Don't run until Firebase auth is settled and we have a user
    enabled: !authLoading && !!user?.email,
    // Role won't change mid-session — no need to refetch on window focus
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { role, roleLoading: authLoading || roleLoading };
};

export default useRole;
