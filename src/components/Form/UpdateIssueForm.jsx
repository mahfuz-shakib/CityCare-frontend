import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { imageUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Container from "../../container/Container";
import { useQueryClient } from "@tanstack/react-query";

const UpdateIssueForm = ({ updateItem, modalRef }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { title, category, description, location } = data;

    try {
      let imageURL = updateItem.image; // Default to existing image
      if (data?.image && data.image[0]) {
        imageURL = await imageUpload(data.image[0]);
      }
      const issueInfo = {
        title,
        category,
        description,
        location,
        image: imageURL,
      };
      console.log(issueInfo);
      axiosSecure
        .patch(`/issues/${updateItem._id}`, issueInfo)
        .then((data) => {
          console.log(data.data);
          toast.success("Updated successfully");
          modalRef.current.close();
          queryClient.invalidateQueries(["issueDetails", updateItem._id]);
        })
        .catch((err) => {
          toast.error("Updated failed");
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className=" max-w-76 md:max-w-[856px]  mx-auto card rounded-lg overflow-hidden my-16"
      >
        <div className={`card-body px-2 md:px-4 bg-gray-100`}>
          <h1 className="text-center  md:text-xl font-bold text-wrap">Update issue Info.</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="! fieldset space-y-2">
              <div className="flex flex-col md:flex-row justify-between gap-5">
                <div className="w-72 md:w-md">
                  <label htmlFor="name" className="label md:text-sm">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input-field"
                    defaultValue={updateItem.title}
                    {...register("title", {
                      required: "Title must be required",
                      minLength: { value: 3, message: "Title atleast 3 character" },
                    })}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message} </p>}
                </div>
                <div className="w-72 md:w-xs">
                  <label className="label md:text-sm">Select Category</label>
                  <br />
                  <select
                    defaultValue={updateItem.category}
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
                    defaultValue={updateItem.location}
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
                      // defaultValue={updateItem.image}
                      {...register("image")}
                      className=" file-input file:bg-lime-50 file:text-lime-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                  </div>
                </div>
              </div>
              <div className="w-72 md:w-full">
                <label className="label md:text-sm">Description</label>
                <br />
                <textarea
                  className="textarea textarea-bordered h-24 md:h-8 md:w-full"
                  defaultValue={updateItem.description}
                  {...register("description", {
                    required: "Description must be required",
                    minLength: { value: 10, message: "Description atleast 10 character" },
                  })}
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message} </p>}
              </div>
            </fieldset>
            <button className={`btn mx-auto w-72  md:w-sm  text-whit mt-4 hover:bg-purple-800  "bg-grad"`}>
              Update Issue
            </button>
          </form>
          <div className="w-fit text-right ">
            <form method="dialog">
              <button className="btn bg-primary/10">Cancel</button>
            </form>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default UpdateIssueForm;
