import React from "react";
import Container from "../../container/Container";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FaSpinner } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

const ReportIssueForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data: reportData,
    mutateAsync: reportIssue,
    isPending: isReporting,
  } = useMutation({
    mutationFn: async (issueData) => await axiosSecure.post("/issues", issueData),
    onSettled: () => {
      console.log("settled data: ", reportData);
    },
    retry: 2,
  });

  const { data, mutateAsync: addTimeline } = useMutation({
    mutationFn: async (timelineInfo) => await axiosSecure.post("/timelines", timelineInfo),
    onSettled: () => {
      console.log("settled data: ", data);
    },
    retry: 2,
  });

  const onSubmit = async (data) => {
    const { title, category, description, location } = data;

    try {
      const imageURL = await imageUpload(data?.image[0]);
      const issueInfo = {
        title,
        category,
        description,
        location,
        image: imageURL,
        reporter: user?.email,
      };

      const result = await reportIssue(issueInfo);
      if (result.data.insertedId) {
        const timelineInfo = {
          issueId: result.data.insertedId,
          message: "Issue Creation",
          updatedBy: "Citizen",
        };
        await addTimeline(timelineInfo);

        // Invalidate user query to refresh freeReport count
        queryClient.invalidateQueries(["users", user?.email]);
        queryClient.invalidateQueries(["issues"]);

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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className=" max-w-76 md:max-w-214 border border-primary/15  mx-auto card rounded-lg overflow-hidden mb-16 mt-8"
      >
        <div className={`card-body px-2 md:px-4 bg-surface-container-low`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="! fieldset space-y-2 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between gap-5">
                <div className="w-72 md:w-md">
                  <label htmlFor="name" className="label md:text-sm">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input-field"
                    placeholder="Enter issue title"
                    {...register("title", {
                      required: "Title must be required",
                      minLength: { value: 3, message: "title atleast 3 character" },
                    })}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message} </p>}
                </div>
                <div className="w-72 md:w-xs">
                  <label className="label md:text-sm">Select Category</label>
                  <br />
                  <select
                    className="select select-bordered"
                    {...register("category", {
                      required: true,
                      minLength: {
                        value: 1,
                        message: "Please Select category",
                      },
                    })}
                  >
                    <option value="">Select Category</option>
                    <option value="road">Road</option>
                    <option value="water">Water</option>
                    <option value="electricity">Electricity</option>
                    <option value="garbage">Garbage</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message} </p>}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10 justify-between">
                <div className="w-72 md:w-md">
                  <label className="label md:text-sm">Location</label>
                  <br />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Jashore"
                    {...register("location", {
                      required: "Location must be required",
                      minLength: { value: 3, message: "Location atleast 3 character" },
                    })}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message} </p>}
                </div>
                <div className="w-72 md:w-xs">
                  <div>
                    <label className="label md:text-sm">Sample Issue Image</label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      {...register("image", {
                        required: "Image must be required",
                      })}
                      className=" file-input file:bg-surface-container-high file:text-primary"
                    />
                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message} </p>}
                  </div>
                </div>
              </div>
              <div className="w-72 md:w-full">
                <label className="label md:text-sm">Description</label>
                <br />
                <textarea
                  className="textarea textarea-bordered h-24 md:h-8 md:w-full"
                  placeholder="Enter description"
                  {...register("description", {
                    required: "Description must be required",
                    minLength: { value: 3, message: "Description atleast 10 character" },
                  })}
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message} </p>}
              </div>

              <button className="btn mx-auto w-72  md:w-full  mt-4 bg-primary hover:bg-primary/90 text-white">
                {isReporting ? <FaSpinner className="animate-spin text-lg" /> : <IoIosSend className="text-lg" />}
                {isReporting ? "Reporting..." : "Report Issue"}
              </button>
            </fieldset>
          </form>
        </div>
      </motion.div>
    </Container>
  );
};

export default ReportIssueForm;
