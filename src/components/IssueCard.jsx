import { FaLocationDot } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import useAuth from "../hooks/useAuth";
import { condition } from "../utils/DisableCondition";
import useAxiosSecure from "../hooks/useAxiosSecure";

const IssueCard = ({ issue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { _id, title, category, image, location, priority, status, reporter } =
    issue;

  const isDisabled = condition(user?.email, reporter);

  const queries = {
    email: user?.email || "",
    issueId: _id,
  };

  const params = new URLSearchParams(queries).toString();
  const queryKey = ["upvotes", user?.email, _id];

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await axiosSecure.get(`/upvotes/?${params}`);
      return res.data; // { allVotes: [], myVote: boolean }
    },
    
  });
  const isLiked =user && !!data?.myVote;
  const voteCount = data?.allVotes?.length || 0;
  
  const addUpvote = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/upvotes", queries);
      return res.data;
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

 
  const removeUpvote = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.delete(`/upvotes?${params}`);
      return res.data;
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /* =======================
     HANDLE CLICK
  ======================= */
  const handleUpvote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isLiked) {
      removeUpvote.mutate();
    } else {
      addUpvote.mutate();
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="card-default">
      <figure>
        <img src={image} alt={title} className="h-48 w-full object-cover" />
      </figure>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaLocationDot className="text-red-500" />
          {location}
        </p>

        <div className="flex gap-5">
          <span className="badge">{status}</span>
          <span className="badge badge-outline">{category}</span>
          <span className="badge">{priority}</span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <button
              onClick={handleUpvote}
              disabled={isDisabled}
              className={`${
                isDisabled
                  ? "cursor-not-allowed text-gray-400"
                  : isLiked
                  ? "text-blue-600 cursor-pointer"
                  : "text-gray-700 cursor-pointer"
              }`}
            >
              <BiSolidLike className="text-[26px]" />
            </button>
            <span>{voteCount}</span>
          </span>

          <Link to={`/all-issues/${_id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
