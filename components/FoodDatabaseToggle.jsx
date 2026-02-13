import { useCallback, useEffect, useRef, useState } from "react";

export default function FoodDatabaseToggle({ activeTab, onTabChange }) {
  const [highlightStyle, setHighlightStyle] = useState({
    left: 0,
    width: 0,
    transition: "none",
  });

  const containerRef = useRef(null);
  const myFoodsRef = useRef(null);
  const fatSecretRef = useRef(null);
  const isInitialMount = useRef(true);

  const moveHighlight = useCallback(() => {
    const activeRef = activeTab === "Optimach" ? myFoodsRef : fatSecretRef;

    if (containerRef.current && activeRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeRef.current.getBoundingClientRect();

      const left = buttonRect.left - containerRect.left;
      const width = buttonRect.width;

      setHighlightStyle({
        left,
        width,
        transition: isInitialMount.current
          ? "none"
          : "transform 0.3s ease-out, width 0.3s ease-out",
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      moveHighlight();
      isInitialMount.current = false;
    }, 50);

    window.addEventListener("resize", moveHighlight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", moveHighlight);
    };
  }, [moveHighlight]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center w-3xs mt-1 font-semibold rounded-md">
      <button
        ref={myFoodsRef}
        onClick={() => onTabChange("Optimach")}
        className={` z-10 flex-1 px-4 py-[0.8rem] text-center text-sm font-medium transition-colors duration-300 shadow-md rounded-l-lg!
         ${
           activeTab === "Optimach"
             ? " bg-[#229100]"
             : "bg-[#f8f8f8] text-black"
         }`}
        style={{
          borderTopLeftRadius: "0.5rem",
          borderBottomLeftRadius: "0.5rem",
        }}>
        <p
          className={`${
            activeTab === "Optimach" ? "text-white " : "text-black"
          }`}>
          Optimach
        </p>
      </button>
      <button
        ref={fatSecretRef}
        onClick={() => onTabChange("fatSecret")}
        className={`relative z-10 flex-1 px-4 py-[0.8rem] text-center  text-sm font-medium transition-colors duration-300 shadow-md rounded-r-lg!
          ${
            activeTab === "fatSecret"
              ? "text-white bg-[#229100]"
              : " bg-[#f8f8f8] text-black"
          }`}
        style={{
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
        }}>
        <p
          className={`${
            activeTab === "fatSecret" ? "text-white " : "text-black"
          }`}>
          FatSecret
        </p>
      </button>
    </div>
  );
}
