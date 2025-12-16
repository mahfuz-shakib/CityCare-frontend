import { FaLocationDot } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import { condition } from "../utils/DisableCondition";

const IssueCard = ({ issue }) => {
  const { user } = useAuth();
  const { _id, title, category, image, location, priority, voteCount, status, reporter } = issue;
  const isDisabled = condition(user, reporter);
  const handleUpVote = () => {
    console.log("vote");
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
            <button onClick={handleUpVote} disabled={isDisabled}>
              <BiSolidLike
                className={`text-[26px] text-gray-700 ${
                  isDisabled ? "cursor-not-allowed" : "hover:scale-101 hover:text-blue-400 cursor-pointer"
                }`}
              />
            </button>
            <span>{voteCount || 0}</span>
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
