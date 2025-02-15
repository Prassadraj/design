import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar"; // Im

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Design Qube",
  description: "Working Inprogress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="background-container">
          {" "}
          {/* <Navbar /> */}
          {/* Container for background */}
          {children}
        </div>
      </body>
    </html>
  );
}
