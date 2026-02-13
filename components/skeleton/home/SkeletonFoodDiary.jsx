import React from "react";
const SkeletonFoodDiaryDashboard = () => (
  <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-6 mb-10 animate-pulse">
    <div className="flex flex-col lg:flex-row items-center gap-10">
      {/* Left: Circle Skeleton */}
      <div className="relative flex items-center justify-center">
        <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-gray-200 border-4 border-gray-100" />
      </div>

      {/* Right: Macros Skeleton */}
      <div className="flex-1 w-full grid grid-cols-3 gap-4 lg:gap-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center px-2">
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonFoodDiaryDashboard;
