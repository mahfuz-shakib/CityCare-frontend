import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUserTie, FaClipboardList, FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";

const StaffProfile = () => {
  const { user, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["staffs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/staffs/?email=${user?.email}`);
      return res.data?.[0];
    },
    enabled: !!user?.email,
  });

  const { data: issuesData } = useQuery({
    queryKey: ["staff-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/?staffEmail=${user?.email}`);
      return res.data?.data || [];
    },
    enabled: !!user?.email,
  });

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: staffData?.displayName || "",
      photoURL: staffData?.photoURL || "",
    },
  });

  useEffect(() => {
    reset({
      displayName: staffData?.displayName || "",
      photoURL: staffData?.photoURL || "",
    });
  }, [staffData, reset]);

  const onSubmit = async (formData) => {
    try {
      const updatePayload = {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      };

      const res = await axiosSecure.patch(`/staffs/${staffData?._id}`, updatePayload);
      if (res?.acknowledged || res?.data) {
        const updated = { ...staffData, ...updatePayload };
        setUser((u) => ({ ...(u || {}), displayName: updated.displayName, photoURL: updated.photoURL }));
        queryClient.invalidateQueries(["staffs", user?.email]);
        setIsEditing(false);
        Swal.fire("Saved", "Profile updated successfully.", "success");
      } else {
        Swal.fire("Error", "Could not update profile.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  if (staffLoading) {
    return <Loader />;
  }

  const stats = {
    assignedIssues: issuesData?.length || 0,
    pending: issuesData?.filter((i) => i.status === "pending").length || 0,
    inProgress: issuesData?.filter((i) => i.status === "in-progress").length || 0,
    resolved: issuesData?.filter((i) => i.status === "resolved" || i.status === "closed").length || 0,
  };

  return (
    <Container>
            <title>Profile</title>
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 shadow-xl rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={staffData?.photoURL || user?.photoURL || "/avatar.png"}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white ring-offset-4 ring-offset-blue-500"
              />
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-4 border-white">
                <FaUserTie className="text-white text-xl" />
              </div>
            </div>

            <div className="flex-1 w-full">
              {!isEditing ? (
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold">{staffData?.displayName || user?.displayName}</h2>
                  <p className="text-blue-100">{staffData?.email || user?.email}</p>
                  <div className="flex gap-2 mt-3 justify-center md:justify-start">
                    <span className="badge badge-lg bg-blue-500 border-blue-400 text-white">Staff Member</span>
                    {staffData?.isAvailable !== false && (
                      <span className="badge badge-lg bg-green-500 border-green-400 text-white">Available</span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-sm bg-white text-blue-600 hover:bg-blue-50 border-0"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white mb-1">Display Name</label>
                        <input
                          {...register("displayName")}
                          className="input input-bordered w-full bg-white"
                          placeholder="Enter display name"
                        />
                      </div>
                      <div className="w-40">
                        <label className="block text-sm font-medium text-white mb-1">Photo URL</label>
                        <input
                          {...register("photoURL")}
                          className="input input-bordered w-full bg-white"
                          placeholder="Photo URL"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      className="btn btn-ghost bg-white/20 text-white hover:bg-white/30"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn bg-white text-blue-600 hover:bg-blue-50">
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <div className="card-body">
              <FaClipboardList className="text-3xl mb-2" />
              <h3 className="text-2xl font-bold">{stats.assignedIssues}</h3>
              <p className="text-blue-100">Assigned Issues</p>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
            <div className="card-body">
              <FaClock className="text-3xl mb-2" />
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
              <p className="text-yellow-100">Pending</p>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="card-body">
              <FaTasks className="text-3xl mb-2" />
              <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
              <p className="text-purple-100">In Progress</p>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <div className="card-body">
              <FaCheckCircle className="text-3xl mb-2" />
              <h3 className="text-2xl font-bold">{stats.resolved}</h3>
              <p className="text-green-100">Resolved</p>
            </div>
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{staffData?.email || user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">Staff Member</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className={`font-medium ${staffData?.isAvailable !== false ? "text-success" : "text-error"}`}>
                    {staffData?.isAvailable !== false ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">Staff Capabilities</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>View assigned issues</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Update issue status</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Add progress updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Track assigned issues</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default StaffProfile;
