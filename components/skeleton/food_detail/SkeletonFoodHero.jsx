import React from "react";

const SkeletonFoodHero = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-pulse">
      {/* Top Section */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1 w-full">
          {/* Badge Placeholder */}
          <div className="h-6 w-32 bg-gray-200 rounded-full mb-4"></div>

          {/* Title Placeholder (H1) */}
          <div className="h-10 md:h-12 w-3/4 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Button Placeholder */}
        <div className="w-full md:w-40 h-12 bg-gray-200 rounded-3xl"></div>
      </div>

      {/* Inputs Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-3xl">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded ml-1"></div>
          <div className="h-[42px] w-full bg-gray-200 rounded-xl"></div>
        </div>

        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded ml-1"></div>
          <div className="h-[42px] w-full bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFoodHero;
