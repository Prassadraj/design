"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaEdit } from "react-icons/fa";

export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch all posts from the backend API
    axios
      .get("/api/post")
      .then((res) => setPosts(data))
      .catch((err) => console.log(err));
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`/api/post`, {
        data: { id: postId },
        headers: { "Content-Type": "application/json" },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdatePost = (postId) => {
    // Logic for updating the post goes here
    // You may navigate to an update page or open a modal for editing
    console.log("Update post:", postId);
  };

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">View Posts</h1>
      </header>
      <main>
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post._id} className="border p-4 rounded relative">
              <div className="flex items-center justify-center space-x-4 absolute top-0 right-2 bottom-0">
                <FaEdit
                  onClick={() => handleUpdatePost(post._id)}
                  className="cursor-pointer text-blue-500 text-2xl"
                />
                <FaTrash
                  onClick={() => handleDeletePost(post._id)}
                  className="cursor-pointer text-red-500 text-2xl"
                />
              </div>
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
