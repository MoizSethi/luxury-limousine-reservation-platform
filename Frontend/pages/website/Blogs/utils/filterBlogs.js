export const filterBlogs = ({ blogs, query, category, sort }) => {
  let result = [...blogs];

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)
    );
  }

  if (category !== "all") {
    result = result.filter((b) => b.category === category);
  }

  if (sort === "newest") result.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === "oldest") result.sort((a, b) => a.date.localeCompare(b.date));

  return result;
};
