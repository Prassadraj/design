import { NextResponse } from "next/server";
import formidable from "formidable";
import { promises as fsPromises } from "fs";
import path from "path";
import connectDB from "@/lib/mongo";
import Post from "@/models/Post";

// Disable Next.js body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET Method to fetch all posts
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all posts from the database
    const posts = await Post.find();

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Method to create a new post
export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract fields and files from the formData
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    // Construct the file path using the path module
    const filePath = path.join(process.cwd(), "public", "uploads", file.name);
    const fileBuffer = await file.arrayBuffer();
    await fsPromises.writeFile(filePath, Buffer.from(fileBuffer));

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

// DELETE Method to delete a post and its file
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // Connect to MongoDB
    await connectDB();

    // Find the post by its ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete the post from MongoDB
    await Post.findByIdAndDelete(id);

    // Delete the file from the server
    const filePath = path.join(process.cwd(), "public", post.imageUrl);
    await fsPromises.unlink(filePath);

    return NextResponse.json({ message: "Post and file deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH Method to update a post and its file
export async function PATCH(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");

    // Debugging logs
    console.log(`Updating post with ID: ${id}`);

    // Extract fields and files from the formData
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    // Connect to MongoDB
    await connectDB();

    // Find the post by its ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update the post details
    post.title = title || post.title;
    post.content = content || post.content;

    if (file) {
      // Delete the old file from the server
      const oldFilePath = path.join(process.cwd(), "public", post.imageUrl);
      await fsPromises.unlink(oldFilePath);

      // Save the new file
      const newFilePath = path.join(process.cwd(), "public", "uploads", file.name);
      const fileBuffer = await file.arrayBuffer();
      await fsPromises.writeFile(newFilePath, Buffer.from(fileBuffer));

      // Update the image URL
      post.imageUrl = `/uploads/${file.name}`;
    }

    // Save the updated post
    await post.save();

    return NextResponse.json({ message: "Post updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
