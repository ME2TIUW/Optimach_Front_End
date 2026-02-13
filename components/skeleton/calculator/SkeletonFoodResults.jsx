import React from "react";

const SkeletonSearchResult = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Generate 8 skeleton cards */}
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-10 h-48 animate-pulse">
          {/* Top Section: Title & Subtitle */}
          <div>
            {/* Title Line */}
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
            {/* Subtitle Line (Serving Size) */}
            <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
          </div>

          {/* Bottom Section: Calories & Macros */}
          <div className="mt-auto">
            {/* Calories Big Number */}
            <div className="flex items-end gap-1 mb-4">
              <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
              <div className="h-3 w-8 bg-gray-200 rounded-md mb-1"></div>
            </div>

            {/* Macros Row (Divider + Text) */}
            <div className="pt-3 border-t border-gray-50 flex gap-2">
              <div className="h-2 w-8 bg-gray-200 rounded"></div>
              <div className="h-2 w-8 bg-gray-200 rounded"></div>
              <div className="h-2 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonSearchResult;
