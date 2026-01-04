"use client";

import { useState, useEffect } from "react";

interface Post {
  _id: string;
  content: string;
  category: string;
  tags: string[];
  alias: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

interface Comment {
  _id: string;
  postId: string;
  content: string;
  alias: string;
  createdAt: string;
  editToken?: string;
  upvotes: number;
  downvotes: number;
}

export default function PostCard({ post }: { post: Post }) {
  const [votes, setVotes] = useState({
    up: post.upvotes,
    down: post.downvotes,
  });
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyAlias, setReplyAlias] = useState("");

  // Edit feature states
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [ownedComments, setOwnedComments] = useState<Record<string, string>>(
    {}
  );

  // User ID management
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let storedId = localStorage.getItem("goodnesseer_user_id");
    if (!storedId) {
      storedId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("goodnesseer_user_id", storedId);
    }
    setUserId(storedId);
  }, []);

  // Load owned comments tokens from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("goodnesseer_owned_comments");
      if (saved) {
        setOwnedComments(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading owned comments", e);
    }
  }, []);

  const saveCommentToken = (commentId: string, token: string) => {
    const updated = { ...ownedComments, [commentId]: token };
    setOwnedComments(updated);
    localStorage.setItem("goodnesseer_owned_comments", JSON.stringify(updated));
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    // Basic optimistic update (doesn't account for toggle/switch logic perfectly but gives feedback)
    setVotes((prev) => ({
      ...prev,
      [type === "upvote" ? "up" : "down"]:
        prev[type === "upvote" ? "up" : "down"] + 1,
    }));

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/posts/${post._id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, userId }),
        }
      );

      if (res.ok) {
        const updatedPost = await res.json();
        setVotes({
          up: updatedPost.upvotes,
          down: updatedPost.downvotes,
        });
      }
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  const fetchComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setLoadingComments(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/posts/${post._id}/comments`
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoadingComments(false);
      setShowComments(true);
    }
  };

  const handleCommentVote = async (
    commentId: string,
    type: "upvote" | "downvote"
  ) => {
    // Optimistic update
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          return {
            ...c,
            upvotes: type === "upvote" ? c.upvotes + 1 : c.upvotes,
            downvotes: type === "downvote" ? c.downvotes + 1 : c.downvotes,
          };
        }
        return c;
      })
    );

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/posts/comments/${commentId}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, userId }),
        }
      );

      if (res.ok) {
        const updatedComment = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  upvotes: updatedComment.upvotes,
                  downvotes: updatedComment.downvotes,
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Comment vote failed", error);
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId: string) => {
    const token = ownedComments[commentId];
    if (!token) return;

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/posts/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent, editToken: token }),
        }
      );

      if (res.ok) {
        const updatedComment = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, content: updatedComment.content } : c
          )
        );
        setEditingCommentId(null);
      } else {
        alert("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment", error);
    }
  };

  const handleReport = async (targetId: string, type: "Post" | "Comment") => {
    const reason = prompt("Why are you reporting this?");
    if (!reason) return;

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/reports`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetId, targetType: type, reason }),
        }
      );
      if (res.ok) {
        alert(
          "Report submitted. Thank you for helping keep the community safe."
        );
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.error("Error reporting:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newComment,
            alias: replyAlias || "Anonymous",
          }),
        }
      );

      if (res.ok) {
        const comment = await res.json();
        if (comment.editToken) {
          saveCommentToken(comment._id, comment.editToken);
        }
        setComments([...comments, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
            {post.category}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            Posted by{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {post.alias}
            </span>
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-900 dark:text-gray-100 text-lg mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => handleVote("upvote")}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          👍 {votes.up}
        </button>
        <button
          onClick={() => handleVote("downvote")}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          👎 {votes.down}
        </button>
        <button
          onClick={fetchComments}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
           {showComments ? "Hide Replies" : "Replies"}
        </button>
        <button
          onClick={() => handleReport(post._id, "Post")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-600 ml-auto"
        >
           Report
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
          {loadingComments ? (
            <p className="text-sm text-gray-500 text-center">
              Loading replies...
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.alias}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      {ownedComments[comment._id] &&
                        editingCommentId !== comment._id && (
                          <button
                            onClick={() => handleEditClick(comment)}
                            className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
                          >
                            Edit
                          </button>
                        )}
                    </div>
                  </div>
                  {editingCommentId === comment._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full rounded border p-2 text-sm dark:bg-gray-800 dark:text-white mb-2 border-gray-300 dark:border-gray-700"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-xs hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            handleCommentVote(comment._id, "upvote")
                          }
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                        >
                          👍 {comment.upvotes || 0}
                        </button>
                        <button
                          onClick={() =>
                            handleCommentVote(comment._id, "downvote")
                          }
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                        >
                          👎 {comment.downvotes || 0}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-gray-500 text-center italic">
                  No replies yet. Be the first to respond!
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="mt-4 space-y-3">
            <textarea
              required
              rows={2}
              placeholder="Write an anonymous reply..."
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Alias (Optional)"
                className="block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                value={replyAlias}
                onChange={(e) => setReplyAlias(e.target.value)}
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
