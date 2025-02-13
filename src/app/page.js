"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch posts from your API or data source
    fetch("/api/post")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Home Page</h1>
      </header>
      <main>
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post._id} className="border p-4 rounded relative">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-32 h-32 object-cover cursor-pointer"
                  onClick={() => handleImageClick(post.imageUrl)}
                />
              )}
            </li>
          ))}
        </ul>
      </main>
      {selectedImage && (
        <dialog
          open={isDialogOpen}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-4 rounded relative max-w-lg max-h-full">
            <FaTimes
              onClick={handleCloseDialog}
              className="absolute top-2 right-2 cursor-pointer text-red-500 text-2xl"
            />
            <img
              src={selectedImage}
              alt="Full Screen"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </dialog>
      )}
    </div>
  );
}
