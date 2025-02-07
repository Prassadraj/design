"use client";

import { useRouter } from "next/navigation";
import { FaUserShield } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  const handleAdminDashboard = () => {
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Home Page</h1>
      </header>
      <main className="flex flex-col items-center gap-4">
        <button
          className="flex items-center bg-blue-500 text-white p-2 rounded"
          onClick={handleAdminDashboard}
        >
          <FaUserShield className="mr-2" />
          Admin Dashboard
        </button>
        {/* Add other navigation buttons if needed */}
      </main>
    </div>
  );
}
