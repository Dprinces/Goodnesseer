"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  "Mental Health",
  "Relationships",
  "Work Stress",
  "Life Advice",
  "Faith",
  "Other",
];

export default function ComposePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    category: CATEGORIES[0],
    tags: "",
    alias: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
        }/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            tags: formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          }),
        }
      );

      if (response.ok) {
        router.push("/feed");
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Post
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                What&apos;s on your mind?
              </label>
              <div className="mt-2">
                <textarea
                  id="content"
                  required
                  rows={4}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                  placeholder="Share your thoughts anonymously..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="alias"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Alias (Optional)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="alias"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                    placeholder="e.g. BlueSky123"
                    value={formData.alias}
                    onChange={(e) =>
                      setFormData({ ...formData, alias: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Tags
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="tags"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                  placeholder="stress, work, help (comma separated)"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Anonymously"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
