import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowUpRight, CheckCircle2, MapIcon, Megaphone, Radio } from "lucide-react";
import Container from "../../../container/Container";
import useResolution from "../../../hooks/useResolution";

const Banner = () => {
  const { data, loading } = useResolution();
  const currentMonth = data?.resolutionPerformance?.at(-1);
  const reportedCount = currentMonth?.reportedCount ?? 0;
  const resolvedCount = currentMonth?.resolvedCount ?? 0;
  const currentResolutionRate = reportedCount > 0 ? Math.round((resolvedCount / reportedCount) * 100) : null;
  const currentMonthDate = currentMonth?.monthKey ? new Date(`${currentMonth.monthKey}-01T00:00:00`) : null;
  const currentMonthLabel = currentMonthDate
    ? `${currentMonthDate.toLocaleString("en-US", { month: "long" })}, ${currentMonthDate.getFullYear()}`
    : "Current month";
  return (
    <section className="relative pt-10 pb-32 overflow-hidden">
      <Container className="grid lg:grid-cols-2 gap-16 items-center ">
        <motion.div className="px-2"  initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-surface-container-high text-primary font-bold text-xs tracking-widest uppercase">
            Community Driven Governance
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Fix Your City, <br />
            <span className="text-primary text-">One Report</span> at a Time
          </h1>
          <p className="font-headline md:text-lg text-secondary mb-8 md:mb-10 max-w-xl leading-relaxed">
            Join thousands of citizens in building a better future. Report infrastructure issues, track resolutions in
            real-time, and hold local authorities accountable through transparency.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-5">
            <Link
              to="/dashboard/report-issue"
              className="text-sm md:text-base px-4 py-3 md:px-8 md:py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all flex items-center gap-2"
            >
              <Megaphone size={20} />
              Report Issue
            </Link>
            <Link
              to="/map-view"
              className="text-sm md:text-base px-4 py-3 md:px-8 md:py-4 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-all flex items-center gap-2"
            >
              <MapIcon size={20} />
              View Map
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative px-1"
        >
          <div className="absolute -z-10 top-0 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] overflow-hidden"></div>
          {loading ? (
            <div className="h-80 rounded-3xl bg-surface-container-high animate-pulse" />
          ) : (
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-blue-900 to-primary  p-7 md:p-8 text-white shadow-2xl lg:rotate-2">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[42px] border-cyan-300/10" />
              <div className="relative flex items-center justify-between border-b border-white/15 pb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300 text-indigo-950">
                    <Radio size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Live civic pulse</p>
                    <p className="mt-1 text-sm text-slate-300">{currentMonthLabel} activity</p>
                  </div>
                </div>
                <ArrowUpRight className="text-cyan-300" size={24} />
              </div>
              <div className="relative mt-6 md:mt-8 flex flex-col md:flex-row items-center gap-6">
                <div
                  className="flex h-24 w-32 md:h-32 md:w-32 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#67e8f9 ${currentResolutionRate ?? 0}%, rgba(255,255,255,0.16) 0)`,
                  }}
                >
                  <div className="flex  h-18 w-24 md:h-24 md:w-24  flex-col items-center justify-center rounded-full bg-blue-950">
                    <span className="text-3xl font-black">
                      {currentResolutionRate === null ? "N/A" : `${currentResolutionRate}%`}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">resolved</span>
                  </div>
                </div>
                <div>
                  <h2 className=" text-[17px] md:text-2xl font-black leading-tight">
                    Small reports. 
                    <br className="hidden md:block" />
                    &nbsp; Visible change.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {resolvedCount} of {reportedCount} reports closed this month.
                  </p>
                </div>
              </div>
              <div className="relative mt-8 grid grid-cols-2 border-t border-white/15 pt-5">
                <div className="border-r border-white/15 pr-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Reported</p>
                  <p className="mt-1 text-3xl font-black">{reportedCount}</p>
                </div>
                <div className="pl-5">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Resolved</p>
                  <p className="mt-1 flex items-center gap-2 text-3xl font-black">
                    {resolvedCount} <CheckCircle2 size={19} className="text-cyan-300" />
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};

export default Banner;
