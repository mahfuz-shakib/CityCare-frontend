import { motion } from "framer-motion";

const PageHeader = ({ eyebrow, title, description, actions, className = "" }) => (
  <motion.header
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`flex flex-wrap items-end justify-between gap-4 ${className}`}
  >
    <div>
      {eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-blue-600">{eyebrow}</p>}
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </motion.header>
);

export default PageHeader;
