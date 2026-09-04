import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const ProfileActions = ({ title = "Useful links", items = [] }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <h3 className="mb-4 text-base font-bold text-slate-800">{title}</h3>
    <div className="divide-y divide-slate-100">
      {items.map(({ to, label, description, icon: Icon,i }) => (
        <Link key={i} to={to} className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
            {Icon && <Icon size={17} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-700 group-hover:text-primary">{label}</span>
            {description && <span className="block text-xs text-slate-400">{description}</span>}
          </span>
          <ArrowRight
            size={16}
            className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary"
          />
        </Link>
      ))}
    </div>
  </section>
);

export default ProfileActions;
