import MenuIcon from "@rsuite/icons/Menu";

export default function HamburgerButton({ setSidebarExpanded }) {
  return (
    <button
      onClick={() => setSidebarExpanded(true)} // Opens the sidebar
      className="p-2 mr-4 rounded-xl border 
                 md:hidden hover:scale-105 transition-transform duration-300
                 flex items-center justify-center "
      aria-label="Open Menu">
      <MenuIcon className="w-6 h-6 text-[#229100]" />
    </button>
  );
}
