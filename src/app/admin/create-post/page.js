"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    id: "",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    // Fetch posts from your API or data source
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Convert to a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPostId) {
      setForm((prev) => ({
        ...prev,
        id: editingPostId,
      }));
    }

    try {
      let response;
      console.log(editingPostId);
      if (editingPostId) {
        response = await axios.patch(`/api/posts`, form);
      } else {
        response = await axios.post(`/api/posts`, form);
      }

      if (response.ok) {
        toast.success(
          editingPostId
            ? "Post updated successfully!"
            : "Post added successfully!"
        );
        setForm({ title: "", content: "", file: null });
        setImageUrl("");
        setEditingPostId(null);
        // Fetch updated posts
        const { data: updatedPosts } = await axios.get("/api/posts");

        setPosts(updatedPosts);
      } else {
        toast.error("Error adding/updating post: " + (await response.text()));
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`/api/posts/${postId}`);
      toast.success("Post deleted successfully!");
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setForm((prev) => ({
      title: post.title,
      content: post.content,
      ...prev,
    }));

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
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
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
