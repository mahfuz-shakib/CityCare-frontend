import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading, data:User } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/?email=${user?.email}`);

      return res.data?.[0] || user;
    },
  });
  const { isLoading: loading, data: Staff } = useQuery({
    queryKey: ["staffs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/staffs/?email=${user?.email}`);
      return res.data?.[0] || user;
    },
  });
  return {User,Staff,isLoading,loading}
};

export default useRole;
