import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUserShield, FaChartLine, FaUsers, FaUserTie, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/?email=${user?.email}`);
      return res.data?.[0];
    },
    enabled: !!user?.email,
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin-stats", user?.email],
    queryFn: async () => {
      const [issuesRes, usersRes, staffsRes, paymentsRes] = await Promise.all([
        axiosSecure.get("/issues"),
        axiosSecure.get("/users/?role=citizen"),
        axiosSecure.get("/staffs"),
        axiosSecure.get("/payments"),
      ]);
      return {
        totalIssues: issuesRes.data?.data?.length || 0,
        totalUsers: usersRes.data?.length || 0,
        totalStaffs: staffsRes.data?.length || 0,
        totalPayments: paymentsRes.data?.length || 0,
        totalRevenue: paymentsRes.data?.reduce((sum, p) => sum + (p.amount || p.amount_total / 100 || 0), 0) || 0,
      };
    },
    enabled: !!user?.email,
  });

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: userData?.displayName || "",
      photoURL: userData?.photoURL || "",
    },
  });

  useEffect(() => {
    reset({
      displayName: userData?.displayName || "",
      photoURL: userData?.photoURL || "",
    });
  }, [userData, reset]);

  const onSubmit = async (formData) => {
    try {
      const updatePayload = {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      };

      const res = await axiosSecure.patch(`/users/${userData?._id}`, updatePayload);
      if (res?.acknowledged || res?.data) {
        const updated = { ...userData, ...updatePayload };
        setUser((u) => ({ ...(u || {}), displayName: updated.displayName, photoURL: updated.photoURL }));
        queryClient.invalidateQueries(["users", user?.email]);
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
            <title>Profile</title>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={userData?.photoURL || user?.photoURL || "/avatar.png"}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white ring-offset-4 ring-offset-purple-600"
              />
              <div className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 border-4 border-white">
                <FaUserShield className="text-white text-xl" />
              </div>
            </div>

            <div className="flex-1 w-full">
              {!isEditing ? (
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold">{userData?.displayName || user?.displayName}</h2>
                  <p className="text-purple-100">{userData?.email || user?.email}</p>
                  <div className="flex gap-2 mt-3 justify-center md:justify-start">
                    <span className="badge badge-lg bg-purple-500 border-purple-400 text-white">
                      Administrator
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-sm bg-white text-purple-600 hover:bg-purple-50 border-0"
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
                    <button type="submit" className="btn bg-white text-purple-600 hover:bg-purple-50">
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {statsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <div className="card-body">
                <FaChartLine className="text-3xl mb-2" />
                <h3 className="text-2xl font-bold">{statsData.totalIssues}</h3>
                <p className="text-blue-100">Total Issues</p>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
              <div className="card-body">
                <FaUsers className="text-3xl mb-2" />
                <h3 className="text-2xl font-bold">{statsData.totalUsers}</h3>
                <p className="text-green-100">Total Citizens</p>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <div className="card-body">
                <FaUserTie className="text-3xl mb-2" />
                <h3 className="text-2xl font-bold">{statsData.totalStaffs}</h3>
                <p className="text-purple-100">Total Staff</p>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
              <div className="card-body">
                <FaCreditCard className="text-3xl mb-2" />
                <h3 className="text-2xl font-bold">৳{statsData.totalRevenue.toFixed(0)}</h3>
                <p className="text-yellow-100">Total Revenue</p>
              </div>
            </div>
          </motion.div>
        )}

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
                  <p className="font-medium">{userData?.email || user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">Administrator</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-medium text-success">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4">Admin Privileges</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Manage all issues</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Assign staff to issues</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Manage users and staff</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>View all payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Access analytics dashboard</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default AdminProfile;
