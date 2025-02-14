"use client";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit, FaPlus, FaArrowLeft } from "react-icons/fa";
import "./style.css";
import Modal from "./modal";
import axios from "axios"; // Import axios

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    try {
      let response;
      if (editingPostId) {
        response = await axios.patch(
          `/api/post/?postId=${editingPostId}`,
          formData
        );
      } else {
        response = await axios.post("/api/post", formData);
      }

      if (response.status === 200) {
        toast.success(
          editingPostId
            ? "Post updated successfully!"
            : "Post added successfully!"
        );
        setTitle("");
        setContent("");
        setImage(null);
        setImageUrl("");
        setEditingPostId(null);
        setIsModalOpen(false);

        const updatedPosts = await axios.get("/api/post");
        setPosts(updatedPosts.data);
      } else {
        const errorText = response.data;
        console.error("Error adding/updating post:", errorText);
        toast.error("Error adding/updating post: " + errorText);
      }
    } catch (error) {
      console.error("Axios Error:", error);
      toast.error("Error: " + error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`/api/post/?postId=${postId}`);

      if (response.status === 200) {
        toast.success("Post deleted successfully!");
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        toast.error("Error deleting post");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl);
    setIsModalOpen(true);
  };

  const handleAddPost = () => {
    setEditingPostId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <ToastContainer />
      <br></br>
      <br></br>
      <header className="mb-8 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="title">Manage Posts</h1>
        </div>
        <div className="flex">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300 ml-4 flex items-center"
            onClick={handleAddPost}
          >
            <FaPlus className="mr-2" /> Add New Post
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-md shadow-lg transform hover:scale-105 transition-all duration-300 ml-4 flex items-center"
            onClick={handleBack}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </header>

      <div className="search-container mb-8">
        <input
          type="text"
          placeholder="Search Posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input w-full p-2 border rounded text-black focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="container">
        <div className="grid">
          {filteredPosts.map((post) => (
            <div key={post._id} className="card">
              <div className="card-actions">
                <FaEdit
                  onClick={() => handleEditPost(post)}
                  className="edit-icon cursor-pointer text-blue-500 text-2xl"
                />
                <FaTrash
                  onClick={() => handleDeletePost(post._id)}
                  className="delete-icon cursor-pointer text-blue-500 text-2xl"
                />
              </div>
              <img src={post.imageUrl} alt={post.title} className="image" />
              <h2 className="designTitle">{post.title}</h2>
              <p className="description">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-3xl font-semibold text-center">
            {editingPostId ? "Update Post" : "Add Post"}
          </h1>
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
          {editingPostId && (
            <input type="hidden" value={editingPostId} className="hidden" />
          )}
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Choose File
            </label>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-32 h-32 object-cover mt-2 rounded cursor-pointer"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ff6200] text-white p-2 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
}
