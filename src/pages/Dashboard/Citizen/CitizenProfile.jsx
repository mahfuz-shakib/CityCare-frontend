import {useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const CitizenProfile = () => {
  const { user, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  // const [isUpdating, setIsUpdating] = useState(false);
  const {data}=useQuery({
    queryKey:['users',user?.email],
    queryFn:async()=> axiosSecure.get(`/users/?email=${user?.email}`)
  })
  const currentUser=data.data[0]
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isDirty },
  // } = useForm({
  //   defaultValues: {
  //     name: user?.displayName || "",
  //     phone: user?.phone || "",
  //     address: user?.address || "",
  //   },
  // });

  /* --------------------------------
      UPDATE PROFILE HANDLER
  ---------------------------------- */
  // const onSubmit = async (data) => {
  //   try {
  //     setIsUpdating(true);

  //     const res = await axiosSecure.patch(`/users/${user._id}`, data);

  //     if (res.data.modifiedCount > 0) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Profile Updated",
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });

  //       setUser((prev) => ({ ...prev, ...data }));
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Update Failed",
  //       text: error.message,
  //     });
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  /* --------------------------------
      STRIPE SUBSCRIPTION HANDLER
  ---------------------------------- */
  const handleSubscribe = async () => {
    try {
      const res = await axiosSecure.post("/payments/create-subscription", {
        email: user.email,
      });

      window.location.replace(res.data.url); // Stripe Checkout URL
    } catch (error) {
      Swal.fire("Payment Error", error.message, "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <div className="card bg-gradient-to-r from-sky-100 to-blue-50 shadow-md">
        <div className="card-body flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={currentUser?.photoURL || "/avatar.png"}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover ring ring-primary ring-offset-2"
            />
          </div>

          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-semibold">{currentUser?.displayName}</h2>
            <p className="text-gray-600">{currentUser?.email}</p>

            <div className="flex justify-center md:justify-start gap-2 mt-2">
              <span className="badge badge-outline badge-primary">
                Citizen
              </span>

              {currentUser?.isPremium && (
                <span className="badge badge-warning">
                  Premium
                </span>
              )}
            </div>
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

      {/* ================= PERSONAL INFORMATION ================= */}
      {/* <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">
            Personal Information
          </h3>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <label className="label">Full Name</label>
              <input
                {...register("name", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.name && (
                <p className="text-error text-sm">Name is required</p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                value={user?.email}
                disabled
                className="input input-bordered w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                {...register("phone")}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">Address</label>
              <input
                {...register("address")}
                className="input input-bordered w-full"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                disabled={!isDirty || isUpdating}
                className="btn btn-primary"
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div> */}

    </div>
  );
};

export default CitizenProfile;
