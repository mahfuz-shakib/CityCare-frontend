import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CitizenProfile = () => {
  const { user, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  // const [isUpdating, setIsUpdating] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => axiosSecure.get(`/users/?email=${user?.email}`),
    enabled: !!user?.email,
  });

  const currentUser = data?.data?.[0];

  const [isEditing, setIsEditing] = useState(false);
 
  /* --------------------------------
      STRIPE SUBSCRIPTION HANDLER
  ---------------------------------- */
  const handleSubscribe = async () => {
    try {
      const userInfo={
        userId:currentUser?._id,
        senderEmail: user?.email,
        photoURL:user?.photoURL
      }
console.log(userInfo)
      const res = await axiosSecure.post("/subscription-payment-session",userInfo );
console.log(res)

      window.location.replace(res.data.url); // Stripe Checkout URL
    } catch (error) {
      Swal.fire("Payment Error", error.message, "error");
    }
  };

  /* ------------------------------
     UPDATE PROFILE HANDLER
  ------------------------------- */
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: currentUser?.displayName || "",
      photoURL: currentUser?.photoURL || "",
    },
  });

  useEffect(() => {
    reset({
      displayName: currentUser?.displayName || "",
      photoURL: currentUser?.photoURL || "",
    });
  }, [currentUser, reset]);

  const onSubmit = async (formData) => {
    try {
      const updatePayload = {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      };

      const res = await axiosSecure.patch(`/users/${currentUser?._id}`, updatePayload);
      if (res?.acknowledged || res?.data) {
        // Update auth context and refetch
        const updated = { ...currentUser, ...updatePayload };
        setUser((u) => ({ ...(u || {}), displayName: updated.displayName, photoURL: updated.photoURL }));
        queryClient.invalidateQueries(["users", user?.email]);
        setIsEditing(false);
        Swal.fire("Saved", "Profile updated successfully.", "success");
      } else if (res?.data && res.data.currentUser) {
        setUser((u) => ({ ...(u || {}), ...res.data.currentUser }));
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-50 shadow-md rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser?.photoURL || "/avatar.png"}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover ring ring-primary ring-offset-2"
            />
          </div>

          <div className="flex-1 w-full">
            {!isEditing ? (
              <div className="text-center md:text-left space-y-1 md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{currentUser?.displayName}</h2>
                  <p className="text-gray-600">{currentUser?.email}</p>
                  <div className="flex gap-2 mt-2 items-center">
                    <span className="badge badge-outline badge-primary">Citizen</span>
                    {currentUser?.isPremium && <span className="badge badge-warning">Premium</span>}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex gap-2 justify-center md:justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
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
                      <label className="block text-sm font-medium text-gray-700">Display Name</label>
                      <input {...register('displayName')} className="input input-bordered w-full mt-1" />
                    </div>

                    <div className="w-40">
                      <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                      <input {...register('photoURL')} className="input input-bordered w-full mt-1" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ================= ACCOUNT STATUS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Subscription */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Subscription</h3>

            {!currentUser?.isPremium ? (
              <>
                <p className="text-gray-600">
                  You are currently on the <strong>Free Plan</strong>.
                </p>
                <p className="text-sm text-gray-500">
                  Free users can submit up to 3 issues.
                </p>

                <button
                  onClick={handleSubscribe}
                  className="btn btn-warning mt-4 w-fit"
                >
                  Upgrade to Premium (৳1000)
                </button>
              </>
            ) : (
              <p className="text-success font-medium">
                Premium subscription active. Unlimited issue reporting enabled.
              </p>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Account Status</h3>

            {currentUser?.isBlocked ? (
              <p className="text-error">
                Your account is currently restricted. Please contact authorities.
              </p>
            ) : (
              <p className="text-success">
                Your account is in good standing.
              </p>
            )}
          </div>
        </div>

      </div>

     

    </div>
  );
};

export default CitizenProfile;
