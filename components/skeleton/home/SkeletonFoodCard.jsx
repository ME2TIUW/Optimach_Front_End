import React from "react";

const SkeletonFoodCard = () => (
  <div className="animate-pulse flex space-x-4 p-4 rounded-2xl bg-white mb-3">
    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
    <div className="flex-1 space-y-2 py-1">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default SkeletonFoodCard;
