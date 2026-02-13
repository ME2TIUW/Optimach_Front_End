import React from "react";

const SkeletonNutritionLabel = () => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div className="h-5 w-48 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
      </div>

      {/* Rows */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 border-b border-gray-50">
            {/* Label */}
            <div className="h-4 w-32 bg-gray-200 rounded"></div>

            {/* Value group */}
            <div className="flex items-center gap-4">
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
              <div className="h-3 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
        <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonNutritionLabel;
