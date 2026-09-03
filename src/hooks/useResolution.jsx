import React from "react";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useResolution = () => {
  const axiosInstance = useAxios();
  const { data, loading } = useQuery({
    queryKey: ["issues", "metrics"],
    queryFn: async () => {
      const res = await axiosInstance.get("/issues/metrics");
      console.log(res);
      return res?.data;
    },
  });
  return { data, loading };
};

export default useResolution;
