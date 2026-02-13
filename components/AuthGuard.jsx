import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTokenExpired } from "@/utils/auth";
import apiClient from "@/config/axios/axios";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        router.replace("/login");
        return;
      }

      if (isTokenExpired(accessToken)) {
        try {
          const response = await apiClient.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          localStorage.setItem("accessToken", response.data.access_token);
          setChecking(false);
        } catch (error) {
          localStorage.clear();
          router.replace("/login");
        }
      } else {
        setChecking(false); // Token is already good
      }
    };

    validateAuth();
  }, [router.pathname]);

  return (
    <>
      {checking && (
        <div className="fixed inset-0 z-9999 bg-white flex items-center justify-center">
          {/* This overlay stays until authorized, but 'children' is rendered behind it */}
          <p>Loading Optimach...</p>
        </div>
      )}
      <div style={{ visibility: checking ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}
