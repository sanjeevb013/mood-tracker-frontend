"use client"
import { use } from "react";
import { useGetDetailedArticle } from "@/hooks/useArticle";
import { useParams } from "next/navigation";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetDetailedArticle(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const article = data.data;
  const publishedDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        {/* {article?.image && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
        )} */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h1 className="text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
            <p className="text-xl text-gray-100 mb-6">{article.description}</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{publishedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to articles</span>
        </Link>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {article.content.map((section, index) => (
            <section key={section._id} className={index > 0 ? "mt-10" : ""}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-3">
                {section.header}
              </h2>

              {section.paragraphs && section.paragraphs.length > 0 && (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {section.bulletPoints.map((point, bpIndex) => (
                    <li key={bpIndex} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Author Info Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Written by</p>
                <p className="text-xl font-semibold text-gray-900">{article.author}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}