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
    await connectDB();
    const posts = await Post.find();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Method to create a new post
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    if (!title || !content || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", file.name);
    const fileBuffer = await file.arrayBuffer();
    await fsPromises.writeFile(filePath, Buffer.from(fileBuffer));

    await connectDB();
    const newPost = new Post({ title, content, imageUrl: `/uploads/${file.name}` });
    await newPost.save();

    return NextResponse.json({ message: "Post created successfully!" });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Method to delete a post and its file
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await connectDB();
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await Post.findByIdAndDelete(id);
    const filePath = path.join(process.cwd(), "public", post.imageUrl);
    await fsPromises.unlink(filePath);

    return NextResponse.json({ message: "Post and file deleted successfully!" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH Method to update a post and its file
export async function PATCH(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    console.log(`Updating post with ID: ${id}`);

    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("image");

    await connectDB();
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    if (file) {
      const oldFilePath = path.join(process.cwd(), "public", post.imageUrl);
      await fsPromises.unlink(oldFilePath);

      const newFilePath = path.join(process.cwd(), "public", "uploads", file.name);
      const fileBuffer = await file.arrayBuffer();
      await fsPromises.writeFile(newFilePath, Buffer.from(fileBuffer));
      post.imageUrl = `/uploads/${file.name}`;
    }

    await post.save();
    return NextResponse.json({ message: "Post updated successfully!" });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
