import React from "react";
import Container from "../../container/Container";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils";

const ReportIssueForm = () => {
  const {user}=useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const imageURL = await imageUpload(data?.image[0]);
    const {title,category,description,location}=data;
    const issueInfo={
          title,
          category,
          description,
          location,
          image:imageURL,
          reporter:{
            name:user.diaplayName,
            email:user.email,
            photo:user.photoURL
          }
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
        <div className={`card-body px-2 bg-indigo-50`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="! fieldset space-y-2">
              <div className="flex flex-col md:flex-row justify-between gap-5">
                <div className="w-72 md:w-md">
                  <label className="label">Issue Title</label>
                  <input
                    type="text"
                    id="name"
                    className="input-field"
                    placeholder="Enter issue title"
                    {...register("title", {
                      required: "title must be required",
                      minLength: { value: 3, message: "title atleast 3 character" },
                    })}
                  />
                </div>
                <div className="w-72 md:w-xs">
                  <label className="label">Select Category</label>
                  <br />
                  <select
                    className="select select-bordered"
                    {...register("category", {
                      required: true,
                    })}
                  >
                    <option disabled>Select category</option>
                    <option>Food</option>
                    <option>Pets</option>
                    <option>Accessories</option>
                    <option>Care Products</option>
                  </select>
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10 justify-between">
                <div className="w-72 md:w-md">
                  <label className="label">Location</label>
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
                </div>
              </div>
              <div className="w-72 md:w-full">
                <label className="label">Description</label>
                <br />
                <textarea
                  className="textarea textarea-bordered h-24 md:h-8 md:w-full"
                  placeholder="Enter description"
                     {...register("description", {
                          required: "Description must be required",
                          minLength: { value: 3, message: "Description atleast 10 character" },
                        })}
                ></textarea>
              </div>
              <div className="w-72 md:w-full">
                <div>
                  <label className="label">Profile Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    {...register("image")}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                    file:bg-lime-50 file:text-lime-700
                    hover:file:bg-lime-100
                    bg-gray-100 border border-dashed border-lime-300 rounded-md cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400
                      py-2"
                  />
                </div>
              </div>
              <button className={`btn mx-auto w-72  md:w-sm  text-white mt-4 hover:bg-purple-800  "bg-grad"`}>
                Report Issue
              </button>
            </fieldset>
          </form>
        </div>
      </motion.div>
      )
    </Container>
  );
};

export default ReportIssueForm;
