"use client";
import "./globals.css";
import { useState,useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const InteriorDesignPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="container">
      <br></br>
      <br></br>
      <h1 className="title">Modern Interior Design</h1>
      <div className="grid">
        {posts.map((post) => (
          <div key={post._id} className="card" onClick={() => handleImageClick(design.image)}>
            <img src={post.imageUrl} alt={post.title} className="image" />
            <h2 className="designTitle">{post.title}</h2>
            <p className="description">{post.content}</p>
          </div>
        ))}
      </div>
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
};

export default InteriorDesignPage;
