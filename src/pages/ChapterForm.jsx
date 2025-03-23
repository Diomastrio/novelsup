import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Loader } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useNovel } from "../services/novelHooks";
import {
  useChapter,
  useCreateChapter,
  useUpdateChapter,
} from "../services/chapterHooks";

const ChapterForm = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();

  // Make isEditMode determination more robust
  const isEditMode = Boolean(chapterId && chapterId !== "new");

  const { data: novel, isLoading: isLoadingNovel } = useNovel(novelId);
  const { data: chapter, isLoading: isLoadingChapter } = useChapter(
    isEditMode ? chapterId : null
  );

  const { createChapter, isLoading: isCreating } = useCreateChapter();
  const { updateChapter, isLoading: isUpdating } = useUpdateChapter();

  const [formData, setFormData] = useState({
    title: "",
    chapter_number: 1,
    content: "",
  });

  useEffect(() => {
    if (isEditMode && chapter) {
      setFormData({
        title: chapter.title || "",
        chapter_number: chapter.chapter_number || 1,
        content: chapter.content || "",
      });
    }
  }, [isEditMode, chapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "chapter_number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateChapter({ id: chapterId, ...formData });
    } else {
      createChapter({ novel_id: novelId, ...formData });
    }
  };

  const isLoading = isLoadingNovel || (isEditMode && isLoadingChapter);
  const isSaving = isCreating || isUpdating;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to={`/novel/${novelId}/chapters`}
            className="flex items-center text-primary hover:underline"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Chapters
          </Link>
        </div>

        <div className="bg-base-200 rounded-xl p-8 shadow-lg">
          <div className="flex items-center mb-6">
            <BookOpen className="mr-3 text-primary" size={24} />
            <div>
              <h1 className="text-2xl font-bold">
                {isEditMode ? "Edit Chapter" : "Add New Chapter"}
              </h1>
              <p className="text-sm opacity-70">{novel?.title}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Chapter Number */}
              <div>
                <label
                  htmlFor="chapter_number"
                  className="block text-sm font-medium mb-2"
                >
                  Chapter Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="chapter_number"
                  name="chapter_number"
                  type="number"
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.chapter_number}
                  onChange={handleChange}
                />
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Chapter Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Chapter title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={20}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="Write your chapter content here..."
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`btn btn-primary px-6 ${
                    isSaving ? "loading" : ""
                  }`}
                >
                  {isSaving
                    ? isEditMode
                      ? "Saving..."
                      : "Creating..."
                    : isEditMode
                    ? "Save Changes"
                    : "Create Chapter"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChapterForm;
