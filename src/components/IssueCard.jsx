import { Link } from "react-router";

const IssueCard = ({issue}) => {
  const {
    _id,
    title,
    category,
    image,
    location,
    priority,
    upvotes,
  } = issue;

  return (
    <div className="card bg-base-100 shadow">
      <figure>
        <img src={image} alt={title} className="h-48 w-full object-cover" />
      </figure>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>

        <p className="text-sm text-gray-500">{location}</p>

        <div className="flex gap-2">
          <span className="badge badge-outline">{category}</span>
          <span
            className={`badge ${
              priority === "high" ? "badge-error" : "badge-info"
            }`}
          >
            {priority}
          </span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-semibold">
            👍 {upvotes || 0}
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
