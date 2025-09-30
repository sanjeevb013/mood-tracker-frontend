"use client"

import { useState, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatchArticle } from "@/hooks/useArticle";

type ContentSection = {
  id: string;
  header: string;
  paragraphs: string[];
  bulletPoints: string[];
};

type FormErrors = {
  title?: string;
  description?: string;
  author?: string;
  image?: string;
  content?: string;
  sections?: { [key: string]: string };
};

type FormState = {
  errors: FormErrors;
  generalError: string;
  success: boolean;
};

async function validateAndPrepareArticle(formData: FormData): Promise<{ 
  errors: FormErrors; 
  articleData?: any;
  isValid: boolean;
}> {
  try {
    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const author = formData.get('author') as string;
    const image = formData.get('image') as string;

    // Extract sections data
    const sectionsData: ContentSection[] = [];
    let sectionIndex = 0;
    
    while (formData.get(`sections[${sectionIndex}].header`)) {
      const header = formData.get(`sections[${sectionIndex}].header`) as string;
      const paragraphs: string[] = [];
      const bulletPoints: string[] = [];

      // Extract paragraphs
      let paraIndex = 0;
      while (formData.get(`sections[${sectionIndex}].paragraphs[${paraIndex}]`)) {
        paragraphs.push(formData.get(`sections[${sectionIndex}].paragraphs[${paraIndex}]`) as string);
        paraIndex++;
      }

      // Extract bullet points
      let bulletIndex = 0;
      while (formData.get(`sections[${sectionIndex}].bulletPoints[${bulletIndex}]`)) {
        bulletPoints.push(formData.get(`sections[${sectionIndex}].bulletPoints[${bulletIndex}]`) as string);
        bulletIndex++;
      }

      sectionsData.push({
        id: crypto.randomUUID(),
        header,
        paragraphs,
        bulletPoints,
      });

      sectionIndex++;
    }

    // Validate form data
    const errors: FormErrors = { sections: {} };

    if (!title?.trim() || title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!description?.trim() || description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long";
    }

    if (!author?.trim() || author.trim().length < 2) {
      errors.author = "Author name must be at least 2 characters long";
    }

    if (!image?.trim() || !isValidUrl(image.trim())) {
      errors.image = "Please provide a valid image URL";
    }

    // Validate content sections
    let hasAtLeastOneValidSection = false;
    
    sectionsData.forEach((section, index) => {
      const sectionNumber = index + 1;
      const hasHeader = section.header.trim().length > 0;
      const hasFilledParagraphs = section.paragraphs.some((p) => p.trim().length > 0);
      const hasFilledBulletPoints = section.bulletPoints.some((bp) => bp.trim().length > 0);
      
      if (hasHeader && !hasFilledParagraphs && !hasFilledBulletPoints) {
        errors.sections![section.id] = `Please fill at least one paragraph or bullet point`;
      }
      
      if (!hasHeader && (hasFilledParagraphs || hasFilledBulletPoints)) {
        errors.sections![section.id] = `Please provide a header for Section ${sectionNumber}`;
      }
      
      if (hasHeader && (hasFilledParagraphs || hasFilledBulletPoints)) {
        hasAtLeastOneValidSection = true;
      }
    });

    if (!hasAtLeastOneValidSection) {
      errors.content = "At least one section with header and content (paragraphs or bullet points) is required";
    }

    // If there are errors, return them
    const hasBasicErrors = !!(errors.title || errors.description || errors.author || errors.image || errors.content);
    const hasSectionErrors = errors.sections && Object.keys(errors.sections).length > 0;

    if (hasBasicErrors || hasSectionErrors) {
      return {
        errors,
        isValid: false,
      };
    }

    // Format data
    const formattedContent = sectionsData
      .filter((section) => section.header.trim())
      .map((section) => {
        const formatted: {
          header: string;
          paragraphs?: string[];
          bulletPoints?: string[];
        } = {
          header: section.header.trim(),
        };

        const filteredParagraphs = section.paragraphs
          .map((p) => p.trim())
          .filter((p) => p);

        const filteredBulletPoints = section.bulletPoints
          .map((bp) => bp.trim())
          .filter((bp) => bp);

        if (filteredParagraphs.length > 0) {
          formatted.paragraphs = filteredParagraphs;
        }

        if (filteredBulletPoints.length > 0) {
          formatted.bulletPoints = filteredBulletPoints;
        }

        return formatted;
      });

    const articleData = {
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      date: new Date().toISOString(),
      image: image.trim(),
      content: formattedContent,
    };

    return {
      errors: {},
      articleData,
      isValid: true,
    };
  } catch (error) {
    console.error("Error validating article:", error);
    return {
      errors: {},
      isValid: false,
    };
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function AddArticlePage() {
  const router = useRouter();
  const { mutate: dispatchArticle, isPending, error } = useDispatchArticle();
  
  const [formState, setFormState] = useState<FormState>({
    errors: {},
    generalError: "",
    success: false,
  });

  const [submittedData, setSubmittedData] = useState<any>(null);

  const [contentSections, setContentSections] = useState<ContentSection[]>([
    {
      id: crypto.randomUUID(),
      header: "",
      paragraphs: [""],
      bulletPoints: [],
    },
  ]);

  const handleSubmit = async (formData: FormData) => {
    const validationResult = await validateAndPrepareArticle(formData);
    
    if (!validationResult.isValid) {
      setFormState({
        errors: validationResult.errors,
        generalError: "",
        success: false,
      });
      return;
    }

    // Print the submitted data to console
    console.log("Submitted Article Data:", validationResult.articleData);
    
    // Also store it in state to display on the page
    setSubmittedData(validationResult.articleData);
    
    // Set success state
    setFormState({
      errors: {},
      generalError: "",
      success: true,
    });

     dispatchArticle(validationResult.articleData, {
    onSuccess: () => {
      // Print the submitted data to console
      console.log("Submitted Article Data:", validationResult.articleData);
      
      // Also store it in state to display on the page
      setSubmittedData(validationResult.articleData);
      
      // Set success state
      setFormState({
        errors: {},
        generalError: "",
        success: true,
      });

      // Optional: Redirect after success
    //   setTimeout(() => {
    //     router.push("/blogs");
    //   }, 2000);
    },
    onError: (error) => {
      setFormState({
        errors: {},
        generalError: error.message || "Failed to add article",
        success: false,
      });
    },
  });

  
  };

  const addSection = () => {
    setContentSections([
      ...contentSections,
      {
        id: crypto.randomUUID(),
        header: "",
        paragraphs: [""],
        bulletPoints: [],
      },
    ]);
  };

  const removeSection = (id: string) => {
    if (contentSections.length > 1) {
      setContentSections(contentSections.filter((section) => section.id !== id));
    }
  };

  const addParagraph = (id: string) => {
    setContentSections(
      contentSections.map((section) =>
        section.id === id
          ? { ...section, paragraphs: [...section.paragraphs, ""] }
          : section
      )
    );
  };

  const removeParagraph = (id: string, index: number) => {
    setContentSections(
      contentSections.map((section) =>
        section.id === id && section.paragraphs.length > 1
          ? {
              ...section,
              paragraphs: section.paragraphs.filter((_, i) => i !== index),
            }
          : section
      )
    );
  };

  const addBulletPoint = (id: string) => {
    setContentSections(
      contentSections.map((section) =>
        section.id === id
          ? { ...section, bulletPoints: [...section.bulletPoints, ""] }
          : section
      )
    );
  };

  const removeBulletPoint = (id: string, index: number) => {
    setContentSections(
      contentSections.map((section) =>
        section.id === id
          ? {
              ...section,
              bulletPoints: section.bulletPoints.filter((_, i) => i !== index),
            }
          : section
      )
    );
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
          >
            <span>←</span> Back to Blogs
          </Link>
          <h1 className="text-4xl font-extrabold mt-4 mb-2">Add New Article</h1>
          <p className="text-lg text-gray-600">
            Fill in the details below to create a new blog article.
          </p>
        </div>

        {/* Success Alert */}
        {formState.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              Article data validated successfully! Check the console for the submitted data.
            </p>
          </div>
        )}


        {/* Error Alert */}
        {(formState.generalError || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">
              {formState.generalError || (error as Error)?.message}
            </p>
          </div>
        )}

        {/* Form */}
        <form action={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm">
          {/* Basic Info Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
              Basic Information
            </h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter article title"
              />
              {formState.errors.title && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief description of the article"
              />
              {formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.description}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold mb-2 text-gray-700">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author name"
              />
              {formState.errors.author && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.author}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold mb-2 text-gray-700">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              {formState.errors.image && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.image}</p>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Article Content
              </h2>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
              >
                + Add Section
              </button>
            </div>

            {formState.errors.content && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {formState.errors.content}
              </p>
            )}

            {contentSections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 space-y-4"
              >
                {/* Section Error Message */}
                {formState.errors.sections?.[section.id] && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">
                      {formState.errors.sections[section.id]}
                    </p>
                  </div>
                )}

                {/* Section Header */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Section {sectionIndex + 1} Header <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name={`sections[${sectionIndex}].header`}
                      defaultValue={section.header}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Introduction, Key Benefits, Conclusion"
                    />
                  </div>
                  {contentSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="mt-8 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                      title="Remove section"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Paragraphs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      Paragraphs <span className="text-red-500">*</span> (or bullet points)
                    </label>
                    <button
                      type="button"
                      onClick={() => addParagraph(section.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600 transition"
                    >
                      + Add Paragraph
                    </button>
                  </div>

                  {section.paragraphs.map((paragraph, paraIndex) => (
                    <div key={paraIndex} className="flex gap-2">
                      <textarea
                        name={`sections[${sectionIndex}].paragraphs[${paraIndex}]`}
                        defaultValue={paragraph}
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        placeholder="Enter paragraph text..."
                      />
                      {section.paragraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(section.id, paraIndex)}
                          className="px-2 text-red-500 hover:text-red-700 text-sm"
                          title="Remove paragraph"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bullet Points */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      Bullet Points <span className="text-red-500">*</span> (or paragraphs)
                    </label>
                    <button
                      type="button"
                      onClick={() => addBulletPoint(section.id)}
                      className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded hover:bg-purple-600 transition"
                    >
                      + Add Bullet Point
                    </button>
                  </div>

                  {section.bulletPoints.map((bulletPoint, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2 items-center">
                      <span className="text-gray-500">•</span>
                      <input
                        type="text"
                        name={`sections[${sectionIndex}].bulletPoints[${bulletIndex}]`}
                        defaultValue={bulletPoint}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Enter bullet point..."
                      />
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(section.id, bulletIndex)}
                        className="px-2 text-red-500 hover:text-red-700 text-sm"
                        title="Remove bullet point"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding Article...
                </span>
              ) : (
                "Add Article"
              )}
            </button>
            <Link
              href="/blogs"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-300 text-center shadow-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}