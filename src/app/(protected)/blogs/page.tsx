// export default function BlogList() {
//   const blogs = [
//     { id: "1", title: "First Blog" },
//     { id: "2", title: "Second Blog" },
//   ];

//   return (
//     <div>
//       <h1>Blogs</h1>
//       {blogs.map((blog) => (
//         <a key={blog.id} href={`/blogs/${blog.id}`}>
//           {blog.title}
//         </a>
//       ))}
//     </div>
//   );
// }

// ✅ This enables **SSG** (Static Site Generation)
"use client"

import Link from "next/link";
import { useState } from "react";
import { useGetArticle } from "@/hooks/useArticle"; // adjust path if needed
import { Article } from "@/types/articleTypes";

export default function BlogList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetArticle(page);

  const articles = data?.articles ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading blogs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-500">Failed to load blogs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4">
            Wellness & Fitness Blogs
          </h1>
          <p className="text-lg opacity-80">
            Explore tips on mental health, mood balance, and fitness to live a
            healthier and happier life.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}`}
              className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold group-hover:text-primary">
                  {blog.title}
                </h2>
                <p className="mt-2 line-clamp-3 opacity-80">
                  {blog.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm opacity-70">
                  <span>{blog.author}</span>
                  <span>{blog.createdAt}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-medium">Page {page}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
