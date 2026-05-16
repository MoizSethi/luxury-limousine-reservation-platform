// src/pages/website/Blogs/mockBlogs.js

export const MOCK_BLOGS = new Array(24).fill(0).map((_, i) => ({
  id: i + 1,
  title: `How to get the most out of your trip — Part ${i + 1}`,
  slug: `how-to-trip-${i + 1}`,
  excerpt:
    "Learn practical tips, packing lists and local secrets to make your travel effortless and memorable.",
  category: ["Travel", "Guides", "Tips"][i % 3],
  date: `2025-0${(i % 9) + 1}-0${(i % 28) + 1}`,
  cover: `https://picsum.photos/seed/blog-${i + 1}/800/500`,
}));
