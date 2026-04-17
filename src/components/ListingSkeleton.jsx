const ListingSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-4 space-y-4">
      {/* Image */}
      <div className="h-40 w-full bg-slate-200 rounded-lg" />

      {/* Title */}
      <div className="h-4 bg-slate-200 rounded w-3/4" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 bg-slate-200 rounded w-20" />
        <div className="h-8 bg-slate-200 rounded w-24" />
      </div>
    </div>
  );
};

export default ListingSkeleton;
