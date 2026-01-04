import express from "express";
import crypto from "crypto";
import Post from "../models/Post";
import Comment from "../models/Comment";

const router = express.Router();

// Get all posts (supports category filter and search)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      filter.$or = [{ content: searchRegex }, { tags: searchRegex }];
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { content, category, tags, alias } = req.body;
    const newPost = new Post({
      content,
      category,
      tags,
      alias: alias || `User${Math.floor(Math.random() * 10000)}`,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating post", error: err });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err });
  }
});

// Vote on a post
router.post("/:id/vote", async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const update =
      type === "upvote" ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
    const post = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: "Error voting", error: err });
  }
});

// Get comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({
      createdAt: 1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err });
  }
});

// Add a comment to a post
router.post("/:id/comments", async (req, res) => {
  try {
    const { content, alias } = req.body;
    const editToken = crypto.randomBytes(16).toString("hex");
    const newComment = new Comment({
      postId: req.params.id,
      content,
      alias: alias || `User${Math.floor(Math.random() * 10000)}`,
      editToken,
    });
    const savedComment = await newComment.save();
    // Return the complete object including the editToken for the creator
    const response = savedComment.toObject();
    response.editToken = editToken;
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ message: "Error adding comment", error: err });
  }
});

// Edit a comment
router.put("/comments/:commentId", async (req, res) => {
  try {
    const { content, editToken } = req.body;

    // Explicitly select editToken since it's hidden by default
    const comment = await Comment.findById(req.params.commentId).select(
      "+editToken"
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Verify ownership
    if (!comment.editToken || comment.editToken !== editToken) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid edit token" });
    }

    comment.content = content;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: "Error updating comment", error: err });
  }
});

// Vote on a comment
router.post("/comments/:commentId/vote", async (req, res) => {
  try {
    const { type, userId } = req.body; // 'upvote' or 'downvote', userId

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const voters = comment.voters || new Map();
    const previousVote = voters.get(userId);

    // If user already voted the same way, remove vote (toggle off)
    if (previousVote === type) {
      voters.delete(userId);
      if (type === "upvote") comment.upvotes--;
      else comment.downvotes--;
    }
    // If user voted differently, switch vote
    else if (previousVote) {
      voters.set(userId, type);
      if (type === "upvote") {
        comment.upvotes++;
        comment.downvotes--;
      } else {
        comment.upvotes--;
        comment.downvotes++;
      }
    }
    // New vote
    else {
      voters.set(userId, type);
      if (type === "upvote") comment.upvotes++;
      else comment.downvotes++;
    }

    comment.voters = voters;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: "Error voting on comment", error: err });
  }
});

export default router;
