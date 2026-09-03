import Container from "../../container/Container";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { imageUpload } from "../../utils";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FaSpinner } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import MapLocation from "../MapLocation";
import { ISSUE_CATEGORIES, formatCategory } from "../../constants/categories";

const ReportIssueForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { mutateAsync: reportIssue, isPending: isReporting } = useMutation({
    mutationFn: (issueData) => axiosSecure.post("/issues", issueData),
    retry: 2,
  });

  const { mutateAsync: addTimeline } = useMutation({
    mutationFn: (timelineInfo) => axiosSecure.post("/timelines", timelineInfo),
    retry: 2,
  });

  const onSubmit = async (data) => {
    try {
      const imageURL = await imageUpload(data.image[0]);

      // location is { address, lat, lng } from the Controller
      const issueInfo = {
        title: data.title,
        category: data.category,
        description: data.description,
        location: data.location.address, // human-readable string
        position: {
          // lat/lng for map marker
          lat: data.location.lat,
          lng: data.location.lng,
        },
        image: imageURL,
        reporter: user?.email,
      };
      console.log(issueInfo);
      const result = await reportIssue(issueInfo);

      if (result.data.insertedId) {
        await addTimeline({
          issueId: result.data.insertedId,
          message: "Issue Creation",
          updatedBy: "Citizen",
        });

        queryClient.invalidateQueries({ queryKey: ["users", user?.email] });
        queryClient.invalidateQueries({ queryKey: ["issues"] });

        toast.success("Issue reported successfully");
        navigate("/dashboard/my-issues");
      }
    } catch (err) {
      toast.error("Failed to report issue. Please try again.");
      console.error(err);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border border-primary/15 mx-auto card rounded-xl overflow-hidden mb-16 mt-6"
      >
        <div className="card-body px-3 md:px-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ── Left column: text fields ── */}
              <div className="flex-1 space-y-4">
                {/* Title */}
                <div>
                  <label className="label text-sm font-semibold text-slate-700">Issue Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter issue title"
                    {...register("title", {
                      required: "Title is required",
                      minLength: { value: 3, message: "Title must be at least 3 characters" },
                    })}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="label text-sm font-semibold text-slate-700">Category</label>
                  <select
                    className="w-full select select-bordered"
                    {...register("category", { required: "Please select a category" })}
                  >
                    <option value="">Select Category</option>
                    {ISSUE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {formatCategory(category)}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>

                {/* Image */}
                <div>
                  <label className="label text-sm font-semibold text-slate-700">Issue Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: "A photo is required" })}
                    className="w-full file-input file:bg-surface-container-high file:text-primary"
                  />
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="label text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    className="w-full textarea textarea-bordered h-28"
                    placeholder="Describe the issue in detail…"
                    {...register("description", {
                      required: "Description is required",
                      minLength: { value: 10, message: "Description must be at least 10 characters" },
                    })}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </div>

              {/* ── Right column: location picker ── */}
              <div className="flex-1">
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Please select a location on the map" }}
                  render={({ field }) => (
                    <MapLocation
                      value={field.value || null}
                      onChange={field.onChange}
                      error={errors.location?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end mt-5">
              {/* Submit */}
              <button
                type="submit"
                disabled={isReporting}
                className="btn w-full sm:w-fit bg-primary hover:bg-primary/90 text-white disabled:opacity-60"
              >
                {isReporting ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" /> Reporting…
                  </>
                ) : (
                  <>
                    <IoIosSend className="text-lg" /> Report Issue
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Container>
  );
};

export default ReportIssueForm;
