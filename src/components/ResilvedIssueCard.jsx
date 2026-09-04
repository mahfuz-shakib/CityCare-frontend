import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import IssueCategoryBadge from '../components/IssueCategoryBadge'
const ResilvedIssueCard = ({ issue }) => {
  const { _id, title, category, image, location } = issue;

  return (
    <div className="group min-h-90 md:min-h-100 bg-surface rounded-2xl overflow-hidden hover:shadow-xl transition-all">
      <div className="h-36 md:h-48 relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={image}
        />
        <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-[11px] md:text-xs font-semibold md:font-bold rounded-full">
          RESOLVED
        </span>
      </div>
      <div className="h-52 flex flex-col justify-between p-5 md:p-6">
        <div className="flex justify-between flex-wrap items-start mb-4 space-y-1">
          <h3 className="font-headline font-bold md:text-xl group-hover:text-primary transition-colors">{title}</h3>
          <IssueCategoryBadge category={category}/>
        </div>
        <div className="flex items-center gap-2 text-secondary text-sm mb-6">
          <MapPin size={14} />
          {location}
        </div>
        <Link to={`/all-issues/${_id}`} className="btn text-base w-full py-6 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-primary hover:text-white transition-all">
          View Details <FaArrowRight/>
        </Link>
      </div>
    </div>
  );
};

ResilvedIssueCard.displayName = "ResilvedIssueCard";

export default ResilvedIssueCard;
