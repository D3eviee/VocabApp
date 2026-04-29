export const SummarySkeleton = () =>  {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4 h-22]">
          <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}