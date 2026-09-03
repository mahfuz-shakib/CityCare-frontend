import { useEffect, useState } from "react";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { auth } from "../firebase/firebase.config";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import { imageUpload } from "../utils";

const AccountSettings = ({ account, collection = "users" }) => {
  const { user, setUser, deleteAccount, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: account?.displayName || user?.displayName || "",
      email: account?.email || user?.email || "",
      phone: account?.phone || "",
    },
  });

  useEffect(() => {
    reset({
      displayName: account?.displayName || user?.displayName || "",
      email: account?.email || user?.email || "",
      phone: account?.phone || "",
      currentPassword: "",
      newPassword: "",
    });
  }, [account, user, reset]);

  const reauthenticate = async (password) => {
    if (!user?.email || !password) throw new Error("Current password is required.");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const emailChanged = values.email.trim() !== (user.email || "");
      if (emailChanged) await reauthenticate(values.currentPassword);

      const uploadedPhoto = values.photo?.[0] ? await imageUpload(values.photo[0]) : undefined;
      const payload = {
        displayName: values.displayName.trim(),
        phone: values.phone.trim(),
        ...(uploadedPhoto ? { photoURL: uploadedPhoto } : {}),
      };
      if (emailChanged) {
        await updateEmail(auth.currentUser, values.email.trim());
        payload.email = values.email.trim();
      }
      await axiosSecure.patch(`/${collection}/${account?._id}`, payload);
      setUser((current) => ({ ...current, ...payload }));
      await queryClient.invalidateQueries({ queryKey: [collection, user?.email] });
      window.dispatchEvent(new CustomEvent("citycare:profile-updated", { detail: payload }));
      toast.success("Account details updated");
      reset({ ...values, currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(
        error.code === "auth/requires-recent-login"
          ? "Enter your current password to change email."
          : error.message || "Could not update account details.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setSaving(true);
    try {
      await reauthenticate(values.currentPassword);
      await updatePassword(auth.currentUser, values.newPassword);
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      toast.error(error.message || "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete your account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete account",
    });
    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/${collection}/${account?._id}`);
      await deleteAccount();
      await logOut();
    } catch (error) {
      toast.error(error.message || "Account deletion failed. You may need to sign in again first.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Account settings</h3>
          <p className="mt-1 text-sm text-slate-500">Update your contact details and account security.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn btn-sm btn-outline border-primary text-primary"
        >
          {open ? "Hide" : "Edit account"}
        </button>
      </div>

      {open && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <h4 className="font-semibold text-slate-700">Personal details</h4>
            <input
              {...register("displayName")}
              className="input-field"
              placeholder="Full name"
              aria-label="Full name"
            />
            <input
              {...register("email")}
              type="email"
              className="input-field"
              placeholder="Email address"
              aria-label="Email address"
            />
            <input
              {...register("phone")}
              type="tel"
              className="input-field"
              placeholder="Phone number"
              aria-label="Phone number"
            />
            <input
              {...register("photo")}
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full file:bg-blue-50 file:text-primary"
              aria-label="Profile photo"
            />
            <input
              {...register("currentPassword")}
              type="password"
              className="input-field"
              placeholder="Current password (only for email change)"
              aria-label="Current password"
            />
            <button disabled={saving} className="btn bg-primary text-white">
              {saving ? "Saving..." : "Save details"}
            </button>
          </form>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700">Security</h4>
            <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-3">
              <input
                {...register("currentPassword")}
                type="password"
                className="input-field"
                placeholder="Current password"
                aria-label="Current password for password change"
              />
              <input
                {...register("newPassword", { minLength: { value: 6, message: "Use at least 6 characters" } })}
                type="password"
                className="input-field"
                placeholder="New password"
                aria-label="New password"
              />
              <button disabled={saving} className="btn btn-outline border-primary text-primary">
                Change password
              </button>
            </form>
            <button type="button" onClick={handleDelete} className="btn btn-outline btn-error">
              Delete account
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AccountSettings;
