import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Users,
  UserCheck,
  DollarSign,
  ShieldCheck,
  Pencil,
  X,
  Check,
  Camera,
} from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { imageUpload } from "../../../utils";

/* ── animation helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    {...fadeUp(delay)}
    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
      <Icon size={18} className="text-white" />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
  </motion.div>
);

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
        totalStaffs: staffsRes.data?.data?.length || 0,
        totalRevenue: paymentsRes.data?.reduce((sum, p) => sum + (p.amount || p.amount_total / 100 || 0), 0) || 0,
      };
    },
    enabled: !!user?.email,
  });

  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: userData?.displayName || "",
    },
  });

  useEffect(() => {
    reset({ displayName: userData?.displayName || "" });
  }, [userData, reset]);

  const onSubmit = async (formData) => {
    try {
      const photoURL = await imageUpload(formData?.image?.[0]);
      const updatePayload = {
        displayName: formData.displayName || userData?.displayName,
        photoURL: photoURL || userData?.photoURL,
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

  if (isLoading) return <Loader />;

  const displayName = userData?.displayName || user?.displayName || "Admin";
  const email = userData?.email || user?.email || "";
  const photoURL = userData?.photoURL || user?.photoURL;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <title>Profile</title>
      <Container className="px-4 md:px-10">
        <div className="pt-8 pb-16 space-y-6">

          {/* ── Page Header ── */}
          <motion.div {...fadeUp(0)}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">Account Settings</p>
            <h1 className="text-3xl font-bold text-slate-900">Admin Profile</h1>
          </motion.div>

          {/* ── Profile Card ── */}
          <motion.div
            {...fadeUp(0.05)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Blue accent bar */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-500" />

            <div className="p-6 md:p-8">
              {!isEditing ? (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt={displayName}
                        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-slate-100">
                        {initials}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                      <ShieldCheck size={13} className="text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
                    <p className="text-slate-500 text-sm mt-0.5">{email}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        Administrator
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 flex items-center gap-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors mx-auto md:mx-0"
                    >
                      <Pencil size={13} /> Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Avatar preview */}
                    <div className="relative shrink-0">
                      {photoURL ? (
                        <img src={photoURL} alt={displayName} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100" />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-slate-100">
                          {initials}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Camera size={12} className="text-white" />
                      </div>
                    </div>

                    {/* Edit fields */}
                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Display Name
                        </label>
                        <input
                          {...register("displayName")}
                          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                          defaultValue={displayName}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Profile Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          {...register("image")}
                          className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex items-center gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
                        >
                          <Check size={13} /> Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsEditing(false); reset(); }}
                          className="flex items-center gap-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors"
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* ── Stats ── */}
          {statsData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FileText} label="Total Issues" value={statsData.totalIssues} color="bg-amber-500" delay={0.1} />
              <StatCard icon={Users} label="Total Citizens" value={statsData.totalUsers} color="bg-indigo-500" delay={0.15} />
              <StatCard icon={UserCheck} label="Total Staff" value={statsData.totalStaffs} color="bg-emerald-500" delay={0.2} />
              <StatCard
                icon={DollarSign}
                label="Total Revenue (TK)"
                value={`৳${statsData.totalRevenue.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`}
                color="bg-blue-600"
                delay={0.25}
              />
            </div>
          )}

          {/* ── Account Info + Privileges ── */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Account Information */}
            <motion.div
              {...fadeUp(0.3)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
            >
              <h3 className="font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="space-y-4">
                {[
                  { label: "Email", value: email },
                  { label: "Role", value: "Administrator" },
                  { label: "Account Status", value: "Active", valueClass: "text-emerald-600 font-semibold" },
                ].map(({ label, value, valueClass }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className={`text-sm font-medium text-slate-800 ${valueClass || ""}`}>{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Admin Privileges */}
            <motion.div
              {...fadeUp(0.35)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
            >
              <h3 className="font-bold text-slate-800 mb-4">Admin Privileges</h3>
              <ul className="space-y-2.5">
                {[
                  "Manage all issues",
                  "Assign staff to issues",
                  "Manage users and staff",
                  "View all payments",
                  "Access analytics dashboard",
                ].map((priv) => (
                  <li key={priv} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-emerald-600" />
                    </div>
                    {priv}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default AdminProfile;
