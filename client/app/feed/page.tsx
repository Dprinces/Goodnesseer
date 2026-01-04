"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import CategorySidebar from "../../components/CategorySidebar";

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

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const fetchPosts = async (category: string, search: string) => {
    setLoading(true);
    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
      }/api/posts?`;
      
      const params = new URLSearchParams();
      if (category && category !== "All Posts") {
        params.append("category", category);
      }
      if (search) {
        params.append("search", search);
      }

      const response = await fetch(url + params.toString());
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-white dark:bg-gray-900 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Community Feed
          </h1>
          
          <div className="flex w-full md:w-auto gap-4">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full md:w-64 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 px-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link
              href="/compose"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap"
            >
              New Post
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">
                  No posts yet in {selectedCategory}. Be the first to share!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
