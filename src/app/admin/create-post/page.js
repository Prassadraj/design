"use client";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Convert to a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl); // Now this will work since setImageUrl is defined
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the data including the file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image); // Append the image file

    try {
      // Make a POST request to the API with FormData
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData, // The FormData includes both text and the file
      });

      if (response.ok) {
        toast.success("Post added successfully!");
        setTitle("");
        setContent("");
        setImage(null);
        setImageUrl(""); // Reset the image preview as well
      } else {
        toast.error("Error adding post");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 border rounded-lg shadow-lg">
      <ToastContainer />
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Add New Post</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded text-black"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-40 object-cover mt-2 rounded"
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Post
        </button>
      </form>
    </div>
  );
}
