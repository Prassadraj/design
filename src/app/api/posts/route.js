import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Post from "@/models/Post";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract fields and files from the formData
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    // Save the file to the uploads directory
    const filePath = `./public/uploads/${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    require("fs").writeFileSync(filePath, Buffer.from(fileBuffer));

    // Connect to MongoDB
    await connectDB();

    // Create and save the new post in MongoDB
    const newPost = new Post({
      title,
      content,
      imageUrl: `/uploads/${file.name}`,
    });

    await newPost.save();

    return NextResponse.json({ message: "Post created successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
