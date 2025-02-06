import { NextResponse } from "next/server";
import formidable from "formidable";
import connectDB from "@/lib/mongo";
import Post from "@/models/Post";

// Disable Next.js body parser to handle file uploads with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Initialize formidable
    const form = new formidable.IncomingForm();
    form.uploadDir = "./public/uploads"; // Directory for file uploads
    form.keepExtensions = true; // Keep file extension

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return NextResponse.json(
          { error: "Error in file upload" },
          { status: 500 }
        );
      }

      // Connect to MongoDB
      await connectDB();

      // Get title, content from form fields
      const { title, content } = fields;

      // Get the image file path
      const imageUrl = files.image ? files.image[0].filepath : null;

      // Create and save the new post in MongoDB
      const newPost = new Post({
        title,
        content,
        imageUrl,
      });

      await newPost.save();

      return NextResponse.json({ message: "Post created successfully!" });
    });
  } catch (error) {
    return NextResponse.json({ error: "Error saving post" }, { status: 500 });
  }
}
