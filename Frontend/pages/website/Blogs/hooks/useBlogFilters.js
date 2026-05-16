import { useMemo, useState } from "react";
import { filterBlogs } from "../utils/filterBlogs";

export default function useBlogFilters(blogs, perPage = 6) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterBlogs({ blogs, query, category, sort }),
    [blogs, query, category, sort]
  );

  const pageCount = Math.ceil(filtered.length / perPage);

  const visible = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const categories = useMemo(
    () => ["all", ...new Set(blogs.map((b) => b.category))],
    [blogs]
  );

  return {
    query, setQuery,
    category, setCategory,
    sort, setSort,
    page, setPage,
    categories,
    filtered,
    visible,
    pageCount
  };
}
