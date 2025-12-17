import { FaLocationDot } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { condition } from "../utils/DisableCondition";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const IssueCard = ({ issue }) => {
  const { user, loading } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  console.log(issue);
  const { _id, title, category, image, location, priority, status, reporter } = issue;
  const isDisabled = condition(user?.email, reporter);
  const axiosSecure = useAxiosSecure();
  const queries = {
    email: user?.email,
    issueId: issue?._id,
  };
  const params = new URLSearchParams(queries).toString();
  const { data, refetch } = useQuery({
    queryKey: ["upvotes", user?.email, issue?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/upvotes?${params}`);
      return res.data; // null or vote object
    },
  });
  useEffect(() => {
    if (data?.myVote) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [data]);
  console.log(data);
  const { data: result, mutateAsync: addUpvote } = useMutation({
    mutationFn: async () => await axiosSecure.post(`/upvotes`, queries),
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        setIsLiked(true);
      }
    },
    onError: (err) => {
      console.log(err);
    },
    retry: 2,
  });
  const { data: response, mutateAsync: removeUpvote } = useMutation({
    mutationFn: async () => await axiosSecure.delete(`/upvotes?${params}`),
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        setIsLiked(false);
      }
    },
    onError: (err) => {
      console.log(err);
    },
    retry: 2,
  });
  const handleUpvote = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }
      if (isLiked) {
        removeUpvote();
        refetch();
        setIsLiked(false);
      } else {
        addUpvote();
        refetch();
        setIsLiked(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className=" card-default">
      <figure>
        <img src={image} alt={title} className="h-48 w-full object-cover" />
      </figure>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          {" "}
          <FaLocationDot className="text-red-500" />
          {location}
        </p>

        <div className="flex gap-5">
          <span
            className={`badge ${
              status === "pending"
                ? "badge-status-pending"
                : status === "in-progress"
                ? "badge-status-progress"
                : status === "working"
                ? "badge-status-working"
                : status === "resolved"
                ? "badge-status-resolved"
                : status === "closed"
                ? "badge-status-closed"
                : status === "rejected"
                ? "badge-status-rejected"
                : "badge-info"
            }`}
          >
            {status}
          </span>
          <span className="badge badge-outline">{category}</span>
          <span
            className={`badge ${
              priority === "high"
                ? "badge-priority-high"
                : priority === "normal"
                ? "badge-priority-normal"
                : "badge-info"
            }`}
          >
            {priority}
          </span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-semibold flex items-center gap-2">
            <button
              onClick={handleUpvote}
              disabled={isDisabled}
              className={`
                      ${isDisabled ? "cursor-not-allowed hover:text-gray-600" : "cursor-pointer"}
                      ${isLiked ? "text-blue-600 hover:text-gray-600" : "text-gray-700 hover:text-blue-400"}`}
            >
              <BiSolidLike className={`text-[26px]`} />
            </button>
            <span>{data?.allVotes.length || 0}</span>
          </span>

          <Link to={`/issues/${_id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
