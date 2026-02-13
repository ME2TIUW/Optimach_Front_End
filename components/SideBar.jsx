import { useEffect } from "react";
import { useRouter } from "next/router";
import NavItem from "./NavItem";
import { handleLogoutUser } from "@/config/axios/axios";

import {
  Home,
  Calculator,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function SideBar({ expanded, setExpanded }) {
  const router = useRouter();

  // Handle auto-collapse on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = (e) => setExpanded(!e.matches);

    handleResize(mediaQuery);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [setExpanded]);

  return (
    <>
      <aside
        className={`
          fixed z-50 md:relative md:translate-x-0 h-full bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-xl
          flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${expanded ? "w-64" : "w-20 -translate-x-full md:translate-x-0"}
        `}>
        {/* --- TOP: LOGO --- */}
        <div
          className="h-20 flex items-center justify-center border-b border-gray-100/50 shrink-0"
          onClick={() => router.push("/home")}>
          <div className="flex items-center gap-3 text-[#229100] font-bold text-xl transition-all duration-300">
            <div className="p-2 bg-green-50 rounded-lg">
              <Zap size={24} fill="currentColor" />
            </div>
            <span
              className={`overflow-hidden transition-all duration-300 ${
                expanded ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}>
              Optimach
            </span>
          </div>
        </div>

        {/* --- MIDDLE: MAIN NAV --- */}
        <nav className="flex-1 flex flex-col gap-1 mt-6 overflow-y-auto">
          <NavItem
            onClick={() => router.push("/home")}
            expanded={expanded}
            label="Home"
            Icon={Home}
            isActive={router.pathname === "/home"}
          />
          <NavItem
            onClick={() => router.push("/calculator")}
            expanded={expanded}
            label="Calculator"
            Icon={Calculator}
            isActive={router.pathname === "/calculator"}
          />
        </nav>

        {/* --- BOTTOM: USER & LOGOUT --- */}
        <div className="border-t border-gray-100 p-2">
          {/* User Profile Link - WILL BE ADDED LATER */}
          {/* <NavItem
            onClick={() => router.push("/profile")}
            expanded={expanded}
            label="Profile"
            Icon={User}
            isActive={router.pathname === "/profile"}
          /> */}

          {/* Logout Button (Red Hover) */}
          <NavItem
            onClick={handleLogoutUser}
            expanded={expanded}
            label="Logout"
            Icon={LogOut}
            isDanger={true} 
          />

          {/* Collapse Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center p-3 mt-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      <div
        onClick={() => setExpanded(false)}
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden
          ${expanded ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      />
    </>
  );
}
