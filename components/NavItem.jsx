import React from "react";

export default function NavItem({
  label,
  onClick,
  Icon,
  expanded,
  isActive,
  color = "#229100", // Default brand green
  isDanger = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative group flex items-center py-3 px-3.5 my-1.5 mx-3 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out overflow-hidden
        ${
          isActive
            ? "bg-green-50 shadow-sm"
            : isDanger
              ? "hover:bg-red-50 text-red-500"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
        }
      `}>
      {/* Active Indicator (Left Border Strip) */}
      {!isDanger && (
        <div
          className={`
          absolute left-0 h-6 w-1 rounded-r-full bg-[#229100] transition-all duration-300
          ${isActive ? "opacity-100" : "opacity-0 -translate-x-2"}
        `}
        />
      )}

      {/* ICON */}
      <div className="flex items-center justify-center shrink-0 transition-colors duration-300">
        <Icon
          size={22}
          color={isDanger ? "#DC2626" : isActive ? color : "currentColor"}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </div>

      <div
        className={`
        ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
        ${expanded ? "w-32 opacity-100" : "w-0 opacity-0"}
      `}>
        <span className={`text-[0.95rem] font-medium`}>{label}</span>
      </div>

      {/* Tooltip for Collapsed State */}
      {!expanded && (
        <div
          className={`
          absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 
          text-white text-xs rounded opacity-0 invisible 
          group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap
          ${isDanger ? "bg-red-500" : "bg-gray-800"} 
        `}>
          {label}
        </div>
      )}
    </div>
  );
}
