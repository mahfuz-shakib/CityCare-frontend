import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUser, FaClipboardList, FaClock, FaSpinner, FaCheckCircle, FaCreditCard, FaCrown, FaBan } from "react-icons/fa";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";

const CitizenProfile = () => {
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
console.log(userData)
  const { data: issuesData } = useQuery({
    queryKey: ["citizen-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/?email=${user?.email}`);
      return res.data?.data || [];
    },
    enabled: !!user?.email,
  });

  const { data: paymentsData = [] } = useQuery({
    queryKey: ["citizen-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data || [];
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

  const handleSubscribe = async () => {
    try {
      const userInfo = {
        userId: userData?._id,
        senderEmail: user?.email,
        photoURL: user?.photoURL,
      };
      const res = await axiosSecure.post("/subscription-payment-session", userInfo);
      window.location.replace(res.data.url);
    } catch (error) {
      Swal.fire("Payment Error", error.message || "Failed to initiate payment", "error");
    }
  };

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

  const stats = {
    totalIssues: issuesData?.length || 0,
    pending: issuesData?.filter((i) => i.status === "pending").length || 0,
    inProgress: issuesData?.filter((i) => i.status === "in-progress" || i.status === "working").length || 0,
    resolved: issuesData?.filter((i) => i.status === "resolved" || i.status === "closed").length || 0,
    totalPayments: paymentsData?.length || 0,
    remainingReports: userData?.freeReport || 0,
  };

  const boostPayments = paymentsData?.filter((p) => p.purpose?.toLowerCase().includes("boost") || p.metadata?.issueId) || [];
  const subscriptionPayments = paymentsData?.filter((p) => p.purpose?.toLowerCase().includes("subscription") || p.metadata?.userId) || [];

  return (
    <Container>
            <title>Profile</title>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-xl rounded-2xl p-8 text-white`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={userData?.photoURL || user?.photoURL || "/avatar.png"}
                alt="profile"
                className={`w-32 h-32 rounded-full object-cover ring-4 ring-white ring-offset-4 ${
                  userData?.isPremium ? "ring-offset-yellow-500" : "ring-offset-blue-500"
                }`}
              />
              {userData?.isPremium && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2 border-4 border-white">
                  <FaCrown className="text-white text-lg" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-4 border-white">
                <FaUser className="text-white text-xl" />
              </div>
            </div>

            <div className="flex-1 w-full">
              {!isEditing ? (
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold">{userData?.displayName || user?.displayName}</h2>
                  <p className="text-blue-100">{userData?.email || user?.email}</p>
                  <div className="flex gap-2 mt-3 justify-center md:justify-start">
                    <span className="badge badge-lg bg-white/20 border-white/30 ">Citizen</span>
                    {userData?.isPremium ? (
                      <span className="badge badge-lg bg-yellow-500 border-yellow-400 ">
                        <FaCrown className="mr-1" />
                        Premium
                      </span>
                    ) : (
                      <span className="badge badge-lg bg-white/20 border-white/30 ">Free Plan</span>
                    )}
                    {userData?.isBlocked && (
                      <span className="badge badge-lg bg-red-500 border-red-400 ">
                        <FaBan className="mr-1" />
                        Blocked
                      </span>
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
          className="grid md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <div className="card-body">
              <FaClipboardList className="text-3xl mb-2" />
              <h3 className="text-2xl font-bold">{stats.totalIssues}</h3>
              <p className="text-blue-100">Total Issues</p>
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
              <FaSpinner className="text-3xl mb-2" />
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
          <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
            <div className="card-body">
              <FaCreditCard className="text-3xl mb-2" />
              <h3 className="text-2xl font-bold">{stats.totalPayments}</h3>
              <p className="text-indigo-100">Payments</p>
            </div>
          </div>
        </motion.div>

        {/* Account Information & Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Subscription Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaCrown className="text-yellow-500" />
                Subscription Plan
              </h3>

              {!userData?.isPremium ? (
                <>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 mb-1">
                        You are currently on the <strong className="text-gray-800">Free Plan</strong>.
                      </p>
                      <p className="text-sm text-gray-500">
                        Free users can submit up to <strong>{stats.remainingReports}</strong> more issue{stats.remainingReports !== 1 ? "s" : ""}.
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Premium Benefits:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>✓ Unlimited issue reporting</li>
                        <li>✓ Priority support</li>
                        <li>✓ Advanced analytics</li>
                        <li>✓ Early access to new features</li>
                      </ul>
                    </div>
                    <motion.button
                      onClick={handleSubscribe}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-warning w-full mt-4"
                    >
                      <FaCrown className="mr-2" />
                      Upgrade to Premium (৳1000)
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4">
                    <p className="text-success font-semibold text-lg mb-2">
                      <FaCrown className="inline mr-2 text-yellow-600" />
                      Premium Subscription Active
                    </p>
                    <p className="text-gray-700">Unlimited issue reporting enabled.</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Subscription Date: {subscriptionPayments[0] ? new Date(subscriptionPayments[0].createdAt || subscriptionPayments[0].created).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Status Card */}
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
                  <p className="font-medium">Citizen</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  {userData?.isBlocked ? (
                    <p className="font-medium text-error flex items-center gap-2">
                      <FaBan />
                      Account Blocked
                    </p>
                  ) : (
                    <p className="font-medium text-success">Active</p>
                  )}
                </div>
                {!userData?.isPremium && (
                  <div>
                    <p className="text-sm text-gray-500">Remaining Free Reports</p>
                    <p className="font-medium text-lg">{stats.remainingReports} / 3</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        {stats.totalPayments > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Payment Summary</h3>
                <Link to="/dashboard/payment-history" className="btn btn-sm btn-outline">
                  View All
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPayments}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Boost Payments</p>
                  <p className="text-2xl font-bold text-green-600">{boostPayments.length}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Subscriptions</p>
                  <p className="text-2xl font-bold text-yellow-600">{subscriptionPayments.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/dashboard/report-issue"
                className="btn btn-primary w-full"
                disabled={!userData?.isPremium && stats.remainingReports === 0}
              >
                <FaClipboardList className="mr-2" />
                Report New Issue
              </Link>
              <Link to="/dashboard/my-issues" className="btn btn-outline w-full">
                <FaClipboardList className="mr-2" />
                View My Issues
              </Link>
              <Link to="/dashboard/payment-history" className="btn btn-outline w-full">
                <FaCreditCard className="mr-2" />
                Payment History
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default CitizenProfile;
