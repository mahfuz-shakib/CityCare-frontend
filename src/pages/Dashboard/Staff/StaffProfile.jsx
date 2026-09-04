import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUserTie } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Container from "../../../container/Container";
import Loader from "../../../components/Loader";
import { imageUpload } from "../../../utils";
import ProfileActions from "../../../components/ProfileActions";
import { ClipboardList, History, Save } from "lucide-react";
import AccountSettings from "../../../components/AccountSettings";

const StaffProfile = () => {
  const { user, setUser, updateUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["staffs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/staffs/?email=${user?.email}`);
      console.log(res);
      return res.data.data?.[0];
    },
    enabled: !!user?.email,
  });
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: "",
      photoURL: "",
    },
  });

  useEffect(() => {
    reset({
      displayName: staffData?.displayName || user?.displayName || "",
      photoURL: staffData?.photoURL || user.photoURL || "",
    });
  }, [staffData, user, reset]);
  const { mutateAsync: updateAvailability, isPending: availabilityUpdating } = useMutation({
    mutationFn: (isAvailable) => axiosSecure.patch(`/staffs/${staffData?._id}`, { isAvailable }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staffs", user?.email] }),
  });
  const onSubmit = async (formData) => {
    try {
      const photoURL = formData?.image?.[0] ? await imageUpload(formData.image[0]) : undefined;
      const updatePayload = {
        displayName: formData?.displayName || staffData?.displayName || user?.displayName,
        photoURL: photoURL || staffData?.photoURL || user?.photoURL,
      };
      await updateUser(updatePayload.displayName, updatePayload.photoURL);
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

  const isAvailable = staffData?.isAvailable !== false;

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
                    <span
                      className={`badge badge-lg border-0 text-white ${isAvailable ? "bg-emerald-500" : "bg-slate-500"}`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2 justify-center md:justify-start"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white mb-1">Display Name</label>
                        <input
                          {...register("displayName")}
                          className="input input-bordered w-full text-black"
                          defaultValue={staffData?.displayName || user.displayName}
                        />
                      </div>
                      <div className="w-54">
                        <label className="label md:text-sm text-white">Upload Image</label>
                        <input
                          type="file"
                          // id="image"
                          accept="image/*"
                          {...register("image")}
                          className="block w-full file-input file:bg-surface-container-high file:text-primary"
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
                  <div className="flex items-center justify-between gap-3">
                    <p className={`font-medium ${isAvailable ? "text-success" : "text-error"}`}>
                      {isAvailable ? "Available" : "Unavailable"}
                    </p>
                    <button
                      type="button"
                      disabled={availabilityUpdating}
                      onClick={() => updateAvailability(!isAvailable)}
                      className="btn btn-sm btn-outline border-primary text-primary"
                    >
                      <Save size={14} /> {availabilityUpdating ? "Updating" : "Change"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProfileActions
            title="Staff workspace"
            items={[
              {
                to: "/dashboard/assigned-issues",
                label: "Assigned issues",
                description: "Open your current work queue",
                icon: ClipboardList,
              },
              {
                to: "/dashboard/assigned-issues",
                label: "Update work status",
                description: "Record progress on assigned reports",
                icon: History,
              },
            ]}
          />
          <AccountSettings account={staffData} collection="staffs" />
        </motion.div>
      </div>
    </Container>
  );
};

export default StaffProfile;
