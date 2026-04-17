import { FaLocationDot } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const ResilvedIssueCard = ({ issue }) => {
  const navigate = useNavigate();
 
  const { _id, title, category, image, location } = issue;

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "badge-warning",
      "in-progress": "badge-info",
      working: "badge-primary",
      resolved: "badge-success",
      closed: "badge-ghost",
      rejected: "badge-error",
    };
    return statusMap[status] || "badge-outline";
  };

  const getPriorityBadgeClass = (priority) => {
    return priority === "high" ? "badge-error" : "badge-outline";
  };

  return (
    <div className="group min-h-100 bg-surface rounded-2xl overflow-hidden hover:shadow-xl transition-all">
      <div className="h-48 relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={image}
        />
        <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
          RESOLVED
        </span>
      </div>
      <div className="h-52 flex flex-col justify-between p-6">
        <div className="flex justify-between flex-wrap items-start mb-4">
          <h3 className="font-headline font-bold text-xl group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-secondary">{category}</p> 
        </div>
        <div className="flex items-center gap-2 text-secondary text-sm mb-6">
          <MapPin size={14} />
          {location}
        </div>
        <Link to={`/all-issues/${_id}`} className="btn text-base w-full py-6 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-primary hover:text-white transition-all">
          View Details
        </Link>
      </div>
    </div>
  );
};

ResilvedIssueCard.displayName = "ResilvedIssueCard";

export default ResilvedIssueCard;
