import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader } from "rsuite";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size="md" content="Redirecting..." />
    </div>
  );
}