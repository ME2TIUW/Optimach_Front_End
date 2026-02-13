import React from "react";

const SkeletonMacroTiles = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          {/* Icon Circle */}
          <div className="w-10 h-10 rounded-xl bg-gray-200 mb-3"></div>

          {/* Big Number */}
          <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>

          {/* Label */}
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonMacroTiles;
