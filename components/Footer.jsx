const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-10 border-t border-gray-200">
      <div className="flex flex-col items-center justify-center text-gray-500 text-sm">
        <p>
          &copy; {currentYear}{" "}
          <span className="font-bold text-[#229100]">Optimach</span>. All rights
          reserved.
        </p>
        <p className="text-xs mt-1">
          Designed & Built by{" "}
          <span className="font-semibold">Nicholas Matthew</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
