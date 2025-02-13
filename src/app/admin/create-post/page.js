"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

export default function AdminPage() {
  const [form, setForm] = useState({ title: "", content: "", image: null, id: "" });
  const [title, setTitle] = useState(""); // Define the title state
  const [content, setContent] = useState(""); // Define the content state
  const [posts, setPosts] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  const handleTitleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      title: e.target.value, // Correctly update the title in the form
    }));
    setTitle(e.target.value); // Keep the separate title state for the input field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingPostId) {
        response = await axios.patch(`/api/posts?postId=${editingPostId}`, form); // Use editingPostId
      } else {
        response = await axios.post(`/api/posts`, form);
      }

      if (response.status === 200) { // Check for successful response status (200 OK)
        toast.success(
          editingPostId
            ? "Post updated successfully!"
            : "Post added successfully!"
        );
        setForm({ title: "", content: "", image: null, id: "" }); // Reset id as well
        setImageUrl("");
        setEditingPostId(null);
        setTitle(""); // Clear the title input field
        setContent(""); // Clear the content input field
        // Fetch updated posts (better to use async/await here too)
        const updatedPostsResponse = await axios.get("/api/posts");
        setPosts(updatedPostsResponse.data);
      } else {
        const errorData = await response.data; // Try to get error details from the server
        toast.error(`Error adding/updating post: ${response.status} - ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error details:", error); // Log the full error for debugging
      toast.error("Error: " + error.message);
    }
  };

  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Convert to a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };


  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setForm({
      title: post.title,
      content: post.content,
      image: null, // Reset image when editing
      id: post._id,
    });
    setTitle(post.title); // Update title state for the input field
    setContent(post.content); // Update content state
    setImageUrl(post.imageUrl);
  };

  return (
    <div className="min-h-screen p-8">
      <ToastContainer />
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create or Edit Post</h1>
      </header>
      <div className="max-w-xl mx-auto p-5 border rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange} // Call handleTitleChange on title change
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
          {editingPostId && (
            <input type="hidden" value={editingPostId} className="hidden" />
          )}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="p-2 border rounded text-black"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {editingPostId ? "Update Post" : "Add Post"}
          </button>
        </form>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-center">Existing Posts</h2>
        <ul className="flex flex-col gap-4 mt-4">
          {posts.map((post) => (
            <li key={post._id} className="border p-4 rounded relative">
              <div className="flex items-center justify-center space-x-4 absolute top-0 right-2 bottom-0">
                <FaEdit
                  onClick={() => handleEditPost(post)}
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
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
