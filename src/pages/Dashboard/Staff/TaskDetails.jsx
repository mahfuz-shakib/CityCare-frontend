import React from "react";
import { Link, useNavigate, useParams } from "react-router";
import Container from "../../../container/Container";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../components/Loader";
import { MdLocationPin } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const TaskDetails = () => {
  const { _id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryKey = ["issueDetails", _id];
  const { data: issue, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${_id}`);
      return res.data;
    },
  });
  const statuses = [
    { id: 1, label: "Pending", value: "pending", color: "bg-amber-200" },
    { id: 2, label: "Working", value: "working", color: "bg-indigo-200" },
    { id: 3, label: "In Progress", value: "in-progress", color: "bg-blue-200" },
    { id: 4, label: "Resolved", value: "resolved", color: "bg-emerald-200" },
    { id: 5, label: "Closed", value: "closed", color: "bg-slate-200" },
  ];
  const handleStatus = async (newStatus) => {
    console.log(newStatus);
    if (!newStatus) return;
    const currentIndex = statuses.findIndex((s) => s.value === issue.status);
    const allowedNext = currentIndex === -1 ? null : statuses[currentIndex + 1]?.value;
    console.log(allowedNext);
    if (newStatus !== allowedNext) {
      toast.error("Invalid status change. You can only advance to the next status in order.");
      return;
    }
    try {
      await axiosSecure.patch(`/issues/${issue._id}`, { status: newStatus });

      toast.success("Status changed successfully!");
      queryClient.invalidateQueries({ queryKey });
    } catch (err) {
      toast.error("Status change failed. Please try again.");
      console.error(err);
    }
  };
  if (isLoading) return <Loader />;
  return (
    <Container>
      <title></title>

      <div className="mt-4 text-sm space-x-2">
        <Link onClick={() => navigate(-1)} className="text-slate-400">
          Assigned Task
        </Link>
        <span className="text-slate-500">&gt;</span> <span className="text-indigo-700">Task #{_id.slice(0, 5)}</span>
      </div>
      <div className="mt-2 space-y-2">
        <h1 className="text-xl md:text-2xl font-bold">{issue.title}</h1>
        <div className="flex  flex-wrap gap-3">
          <p className="flex items-center gap-1 bg-indigo-100 w-fit px-3 py-0.5 rounded-full text-sm">
            <MdLocationPin /> {issue.location}
          </p>
          <p className="flex items-center gap-1 bg-red-100 w-fit px-3 py-0.5 rounded-full text-sm">
            ! {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-10 my-8 max-w-7xl pr-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-1">
                <FaFileAlt className="text-primary" /> <span className="font-bold text-lg">Citizen Issue Report</span>
              </h1>
              <p className="text-secondary">Submitted at {new Date(issue.createdAt).toLocaleString()}</p>
            </div>
            <p className="py-5">{issue.description}</p>
            <img src={issue.image} alt={issue.title} className="w-full h-84 object-cover rounded-lg" />
          </div>
        </div>
        <div className="col-span-1">
          <div className=" bg-white rounded-lg p-6">
            <h1 className="text-sm text-secondary">WORK STATUS</h1>
            <form className="mt-3 space-y-3">
              {statuses.map((s, i) => {
                const currentIndex = statuses.findIndex((x) => x.value === issue.status);
                const isCompleted = i < currentIndex;
                const isCurrent = i === currentIndex;
                const isNext = i === currentIndex + 1;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between rounded-lg p-5 ${isCurrent ? s.color : "bg-surface-container-low/50"}`}
                  >
                    <label htmlFor={s.value} className="flex items-center gap-2">
                      <h1
                        className={`size-2.5 rounded-full ${isCompleted || isCurrent ? "bg-green-500" : "bg-slate-400"}`}
                      />{" "}
                      <span className={`${isCompleted ? "text-slate-400 line-through" : ""}`}>{s.label}</span>
                    </label>
                    <input
                      type="radio"
                      name="workStatus"
                      id={s.value}
                      className={`size-5  ${isNext ? "cursor-pointer" : "cursor-not-allowed"}`}
                      value={s.value}
                      defaultChecked={isCurrent}
                      disabled={!isNext && !isCurrent}
                      onChange={() => isNext && handleStatus(s.value)}
                    />
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TaskDetails;
