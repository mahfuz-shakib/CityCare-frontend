import React, { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import Container from "../../../container/Container";
const MyIssues = () => {
  const { user, loading } = useAuth();

  if (user) console.log(user);
  const [filters, setFilters] = useState({ email: user?.email, status: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  console.log(filters);

  const axiosSecure = useAxiosSecure();
  const { data: myIssues = [], isLoading } = useQuery({
    queryKey: ["issues", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await axiosSecure.get(`/issues/?${params}`);
      return res.data;
    },
  });
  if (loading || isLoading) return <p>loading....</p>;
  return (
    <Container>
      <h1>citizen: my issues: {myIssues.length}</h1>
      <motion.table
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="table max-w-6xl mx-auto"
      >
        {/* head */}
        <thead>
          <tr className="bg-green-50">
            <th>SL. No. </th>
            <th>Title</th>
            <th>Reported At</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {myIssues?.map((list, index) => {
            if (list.status !== "pending") {
              setIsDisabled(true);
            }
            return (
              <tr key={list._id} className={`${index % 2 ? "bg-gray-50" : "bg-violet-50"}`}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={list.image} alt={list.title} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{list.title}</div>
                      <div className="text-sm opacity-50">({list.location})</div>
                    </div>
                  </div>
                </td>

                <td>{list.createdAt}</td>
                <td>
                  <button className="badge badge-secondary btn-xs">{list.status}</button>
                </td>
                <td className="opacity-75">{list.priority}</td>
                <td>
                  <button
                    // onClick={() => handleUpdate(list)}
                    className="btn badge badge-primary btn-xs hover:scale-101"
                    disabled={isDisabled}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    // onClick={() => handleDelete(list)}
                    className="btn badge badge-secondary btn-xs hover:scale-101"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    // onClick={() => handleDelete(list)}
                    className="btn badge badge-primary btn-xs hover:scale-101"
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </motion.table>
    </Container>
  );
};

export default MyIssues;
