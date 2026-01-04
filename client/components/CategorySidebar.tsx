"use client";

import { useState } from "react";

const CATEGORIES = [
  "All Posts",
  "Mental Health",
  "Relationships",
  "Work Stress",
  "Life Advice",
  "Faith",
  "Other",
];

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategorySidebar({
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Categories
        </h2>
        <nav className="space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCategory === category
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
