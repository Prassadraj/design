"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.message.trim()) errors.message = "Message cannot be empty";
    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Contact Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center p-16">
        <h4 className="text-[#e68900] uppercase font-semibold">Contact Us</h4>
        <h1 className="text-4xl font-bold text-black mt-2">
          Let's Create Something <br /> Great Together
        </h1>
        <p className="text-black mt-4">
          Slando is a full-service landscape company. Our established systems
          allow us to deliver industry
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              name="name"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none text-black ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
            <input
              type="text"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
          className={`w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none text-black ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          </div>
          <textarea
            name="message"
            placeholder="Enter Your Message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full p-3 h-28  border border-gray-300 rounded-lg focus:outline-none text-black ${errors.email ? "border-red-500" : "border-gray-300"}`}
            // className="w-full p-3 h-28 border border-gray-300 rounded-lg focus:outline-none text-black"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#e68900] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc7700] transition-all"
          >
            {status === "loading" ? "Sending..." : "Send"}
          </button>
        </form>

        {/* Status Messages */}
        {status === "success" && (
          <div className="fixed bottom-6 right-6 flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Submitted successfully!
          </div>
        )}

        {status === "error" && (
          <div className="fixed bottom-6 right-6 flex items-center bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Something went wrong. Please try again.
          </div>
        )}
      </div>

      {/* Right Side: Google Map (Updated Embed URL) */}
      <div className="w-1/2">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31093.565012568615!2d80.151149!3d13.055036!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5261f3cfe7483d%3A0x9d81d83c1dc19bca!2sDESIGN%20QUBE!5e0!3m2!1sen!2sin!4v1739612052089!5m2!1sen!2sin"
        ></iframe>
      </div>
    </div>
  );
}
