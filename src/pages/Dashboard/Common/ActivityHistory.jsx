import React from "react";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import CitizenActivities from "../Citizen/CitizenActivities";
import AdminActivities from "../Admin/AdminActivities";
import StaffActivities from "../Staff/StaffActivities";
import Loader from "../../../components/Loader";

const ActivityHistory = () => {
  const { loading } = useAuth();
  // const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();

  if (roleLoading || loading) {
    return <Loader />;
  }

  if (role === "admin") {
    return <AdminActivities />;
  } else if (role === "staff") {
    return <StaffActivities />;
  } else {
    return <CitizenActivities />;
  }
};

export default ActivityHistory;
