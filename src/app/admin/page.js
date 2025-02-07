"use client";

import { useRouter } from "next/navigation";
import { FaPlus, FaEye } from "react-icons/fa";

export default function AdminDashboard() {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push("/admin/create-post");
  };

  const handleViewPosts = () => {
    router.push("/admin/view-posts");
  };

  return (
    <div className="grid grid-rows-[20px_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <button
            className="flex items-center bg-blue-500 text-white p-2 rounded"
            onClick={handleCreatePost}
          >
            <FaPlus className="mr-2" />
            Create Post
          </button>
          <button
            className="flex items-center bg-green-500 text-white p-2 rounded"
            onClick={handleViewPosts}
          >
            <FaEye className="mr-2" />
            View Posts
          </button>
        </div>
      </main>
    </div>
  );
}