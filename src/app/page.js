import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Bar */}
      <div className="bg-[#e68900] text-white px-6 py-2 flex justify-between items-center">
        <span>📞 9962571117</span>
        <div className="flex space-x-3">
          <FaFacebookF className="cursor-pointer" />
          <FaInstagram className="cursor-pointer" />
          <FaTelegramPlane className="cursor-pointer" />
          <FaYoutube className="cursor-pointer" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-10 py-5 text-white">
        <div>
          <Image
            src="/logo.png"
            alt="Design Qube Logo"
            width={120}
            height={50}
          />
        </div>
        <div className="space-x-6 text-lg">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Projects
          </a>
          <a href="#" className="hover:underline">
            Services
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
        </div>
        <div className="bg-white p-2 rounded-full cursor-pointer">🔍</div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center flex-grow text-white">
        <div className="bg-black bg-opacity-60 px-6 py-4 rounded-lg">
          <h1 className="text-5xl font-bold">Welcome to Design Qube</h1>
        </div>
        <br></br>
        <div className="bg-black bg-opacity-60 px-4 py-2 rounded-lg">
    <p className="text-lg">A Complete Solution for Your Flooring Vision.</p>
  </div>

        <button className="mt-6 bg-[#e68900] px-6 py-3 text-lg font-semibold rounded-lg hover:bg-[#cc7700]">
          Our Solutions
        </button>
      </div>
    </div>
  );
}
