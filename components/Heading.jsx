import { handleLogoutUser } from "@/config/axios/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Dropdown } from "rsuite";

export default function Heading({ Header, children }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    try {
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUserData(parsedUserData);
      } else {
        console.error("user data is not in localStorage");
      }
    } catch (error) {
      console.error("Error fetching user data from localStorage : ", error);
    }
  }, []);

  useEffect(() => {
    console.log("userData = ", userData);
  }, [userData]);

  return (
    <div>
      <div className="w-full flex items-start justify-center md:justify-between md:items-center gap-2 ">
        <p className="text-[#1F8300] text-xl sm:text-2xl md:text-4xl text-shadow-sm font-semibold  relative">
          {Header}
        </p>
      </div>
    </div>
  );
}
