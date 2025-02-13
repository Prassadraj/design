"use client";
import { useState, useEffect,useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit, FaPlus, FaArrowLeft } from "react-icons/fa";
import "./style.css";
import Modal from "./modal";
import axios from "axios"; // Import axios

export default function AdminPage() {
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [Posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
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
        // Check status code for success
        toast.success(
          editingPostId
            ? "Post updated successfully!"
            : "Post added successfully!"
        );
        settitle("");
        setcontent("");
        setImage(null);
        setImageUrl("");
        setEditingPostId(null);
        setIsModalOpen(false);

        const updatedPosts = await axios.get("/api/post");
        setPosts(updatedPosts.data);
      } else {
        const errorText = response.data; //axios automatically parses the error
        console.error("Error adding/updating Post:", errorText);
        toast.error("Error adding/updating Post: " + errorText);
      }
    } catch (error) {
      console.error("Axios Error:", error); // Log the full Axios error
      toast.error("Error: " + error.message); // Display a user-friendly message
    }
  };

  const handleDeletePost = async (PostId) => {
    try {
      const response = await axios.delete(`/api/post/?postId=${PostId}`);

      if (response.status === 200) {
        toast.success("Post deleted successfully!");
        setPosts(Posts.filter((Post) => Post._id !== PostId));
      } else {
        toast.error("Error deleting Post");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleEditPost = (Post) => {
    setEditingPostId(Post._id);
    settitle(Post.title);
    setcontent(Post.content);
    setImageUrl(Post.imageUrl);
    setIsModalOpen(true);
  };

  const handleAddPost = () => {
    setEditingPostId(null);
    settitle("");
    setcontent("");
    setImageUrl("");
    setIsModalOpen(true);
  };
  const handleBack = () => {
    window.history.back();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Convert to a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
  };

  const filteredPosts = Posts.filter(
    (Post) =>
      Post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <ToastContainer />
      <header className="mb-8 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-semibold">Manage Posts</h1>
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

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search Posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded text-black transform transition-transform duration-300 hover:scale-75 hover:z-10 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {filteredPosts.map((Post) => (
            <li
              key={Post._id}
              className="border border-orange-500 p-4 rounded relative transform transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10 overflow-hidden"
            >
              <div className="flex items-center justify-center space-x-4 absolute top-0 right-2 bottom-0">
                <FaEdit
                  onClick={() => handleEditPost(Post)}
                  className="cursor-pointer text-blue-500 text-2xl"
                />
                <FaTrash
                  onClick={() => handleDeletePost(Post._id)}
                  className="cursor-pointer text-blue-500 text-2xl"
                />
              </div>
              <h2 className="text-xl font-bold">{Post.title}</h2>
              <p>{Post.content}</p>
              {Post.imageUrl && (
                <img
                  src={Post.imageUrl}
                  alt={Post.title}
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-3xl font-semibold text-center">
            {" "}
            {editingPostId ? "Update Post" : "Add Post"}
          </h1>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setcontent(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
          {editingPostId && (
            <input type="hidden" value={editingPostId} className="hidden" />
          )}
          <div className="flex flex-col items-center justify-center">
            {" "}
            {/* Center content vertically and horizontally */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden" // Hide the default input
              id="fileInput" // Add an ID to the input
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {" "}
              {/* Style the label */}
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
