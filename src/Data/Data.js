import {
  AlertTriangle,
  Navigation,
  PlusCircle,
  Target,
  Hammer,
  Droplets,
  Zap,
  Trash2,
  Shield,
  MoreHorizontal,
  Upload,
  UserCheck,
  ClipboardCheck,
  Star,
} from "lucide-react";

export const quickActions = [
  {
    icon: PlusCircle,
    title: "Report Issue",
    desc: "Submit a new civic problem with photos and location details.",
    color: "primary",
    bg: "bg-blue-100",
  },
  {
    icon: Target,
    title: "Track Complaint",
    desc: "Check the real-time status of your previously reported issues.",
    color: "orange-600",
    bg: "bg-orange-100",
  },
  {
    icon: Navigation,
    title: "View Nearby",
    desc: "Explore active and resolved issues in your current neighborhood.",
    color: "slate-600",
    bg: "bg-slate-100",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Report",
    desc: "Direct line for critical issues requiring immediate attention.",
    color: "red-600",
    bg: "bg-red-100",
  },
];
// -----------------------------------------------------
export const stats = [
  { label: "Total Issues", value: "24,561", color: "primary", progress: "100%" },
  { label: "Resolved", value: "18,942", color: "emerald-500", progress: "77%" },
  { label: "Pending", value: "3,450", color: "orange-400", progress: "14%" },
  {
    label: "Avg Resolution",
    value: "3.4",
    unit: "days",
    color: "blue-800",
    trend: "12% faster than last month",
  },
];

// -----------------------------------------------------
export const categories = [
  { icon: Hammer, label: "Road Damage" },
  { icon: Droplets, label: "Water Supply" },
  { icon: Zap, label: "Electricity" },
  { icon: Trash2, label: "Waste Mgmt" },
  { icon: Shield, label: "Public Safety" },
  { icon: MoreHorizontal, label: "Others" },
];
// -----------------------------------------------------
export const issueLifecycles = [
  { icon: Upload, title: "1. Submit", desc: "Snap a photo, add details & location." },
  { icon: UserCheck, title: "2. Assign", desc: "Automated routing to right department." },
  { icon: Hammer, title: "3. Work", desc: "Teams dispatched to resolve the issue." },
  { icon: ClipboardCheck, title: "4. Resolve", desc: "Final inspection and status update." },
  { icon: Star, title: "5. Feedback", desc: "Rate the quality and speed of service." },
];
// -----------------------------------------------------

export const testimonials = [
  {
    name: "Rahman Ali",
    role: "Local Resident",
    image: "i",
    text: "CityCare made it so easy to report the pothole near my house. It was fixed within a week!",
    rating: 5,
  },
  {
    name: "Fatima Begum",
    role: "Business Owner",
    image: "i",
    text: "The broken streetlight outside my shop was reported and fixed quickly. Great service!",
    rating: 5,
  },
  {
    name: "Karim Uddin",
    role: "Community Leader",
    image: "i",
    text: "This platform has transformed how we engage with city services. Highly recommended!",
    rating: 5,
  },
];
// -----------------------------------------------------
export const getChartData = (issues) => {
  let reported = {};
  let resolved = {};
  const months = {
    '-01': "Jan",
    '-02': "Feb",
    '-03': "Mar",
    '-04': "Apr",
    '-05': "May",
    '-06': "Jun",
    '-07': "Jul",
    '-08': "Aug",
    '-09': "Sep",
    '-10': "Oct",
    '-11': "Nov",
    '-12': "Dec",
  };
  console.log("months: ", months);
  issues.forEach((issue) => {
    const reportedMonth = `${new Date(issue.createdAt).toISOString().slice(0, 7)}`; //2026-04
    if (issue.resolvedAt) {
      const resolvedMonth = `${new Date(issue.resolvedAt).toISOString().slice(0, 7)}`; //2026-04 null
      const preRes = (resolved[resolvedMonth] || 0) + 1;
      resolved[resolvedMonth] = preRes;
    }
    const preRep = (reported[reportedMonth] || 0) + 1;
    reported[reportedMonth] = preRep;
  });
  console.log(reported, resolved);
  const data = Object.keys(reported).map((item) => {
    return {
      month:months[item.slice(4,7)],
      reports:reported[item] || 0,
      resolved:resolved[item] || 0
    }
  });
  return data;
};
