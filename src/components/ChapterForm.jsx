import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Loader,
  Eye,
  Edit,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  const [viewMode, setViewMode] = useState("write"); // "write" or "preview"

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

  const insertMarkdown = (tag, placeholder = "") => {
    const textarea = document.getElementById("content");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end) || placeholder;

    let insertion = "";
    switch (tag) {
      case "bold":
        insertion = `**${selectedText}**`;
        break;
      case "italic":
        insertion = `*${selectedText}*`;
        break;
      case "unorderedList":
        insertion = `\n- ${selectedText}`;
        break;
      case "orderedList":
        insertion = `\n1. ${selectedText}`;
        break;
      case "link":
        insertion = `[${selectedText}](url)`;
        break;
      case "image":
        insertion = `![${selectedText}](image-url)`;
        break;
      case "code":
        insertion = `\`${selectedText}\``;
        break;
      default:
        insertion = selectedText;
    }

    const newText = text.substring(0, start) + insertion + text.substring(end);
    setFormData((prev) => ({ ...prev, content: newText }));

    // Focus and set cursor position after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + insertion.length,
        start + insertion.length
      );
    }, 0);
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
                  Chapter Number <span className="">*</span>
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
                  Chapter Title <span className="">*</span>
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
                  Content <span className="">*</span>
                </label>

                {/* Markdown Toolbar */}
                <div className="flex mb-2 space-x-2 bg-base-300 p-2 rounded-t-md">
                  <button
                    type="button"
                    onClick={() => insertMarkdown("bold", "bold text")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Bold"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("italic", "italic text")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Italic"
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("unorderedList", "list item")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Bullet List"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("orderedList", "list item")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Numbered List"
                  >
                    <ListOrdered size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("link", "link text")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Link"
                  >
                    <LinkIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("image", "image alt")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Image"
                  >
                    <Image size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("code", "code")}
                    className="p-1 hover:bg-base-100 rounded"
                    title="Inline Code"
                  >
                    <Code size={18} />
                  </button>
                  <div className="flex-grow"></div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setViewMode("write")}
                      className={`p-1 px-2 rounded-l ${
                        viewMode === "write"
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-100"
                      }`}
                    >
                      <Edit size={18} className="mr-1 inline" /> Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("preview")}
                      className={`p-1 px-2 rounded-r ${
                        viewMode === "preview"
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-100"
                      }`}
                    >
                      <Eye size={18} className="mr-1 inline" /> Preview
                    </button>
                  </div>
                </div>

                {/* Editor or Preview based on mode */}
                {viewMode === "write" ? (
                  <textarea
                    id="content"
                    name="content"
                    rows={20}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    placeholder="Write your chapter content here using Markdown..."
                    value={formData.content}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="w-full h-[500px] overflow-y-auto border border-gray-300 rounded-b-md p-4 prose prose-lg max-w-none bg-base-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content || "Preview will appear here..."}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Markdown Help Text */}
                <div className="mt-2 text-xs ">
                  Use Markdown syntax for formatting: **bold**, *italic*,
                  [links](url), etc.
                </div>
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
