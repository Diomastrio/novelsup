import React from "react";
import { Bookmark, BookmarkCheck, Loader } from "lucide-react";
import {
  useIsBookmarked,
  useBookmarkNovel,
  useRemoveBookmark,
} from "../services/bookmarkHooks";
import { useUser } from "../authentication/authHooks";
import { useNavigate } from "react-router-dom";

function BookmarkButton({ novelId, size = 20, className = "" }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: isBookmarked, isLoading: isCheckingBookmark } =
    useIsBookmarked(novelId);
  const { bookmarkNovel, isBookmarking } = useBookmarkNovel();
  const { removeBookmark, isRemoving } = useRemoveBookmark();

  const isLoading = isCheckingBookmark || isBookmarking || isRemoving;

  const handleToggleBookmark = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isBookmarked) {
      removeBookmark(novelId);
    } else {
      bookmarkNovel(novelId);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      className={`p-2 hover:bg-gray-800 rounded-full ${className}`}
      disabled={isLoading}
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isLoading ? (
        <Loader size={size} className="animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck size={size} className="text-primary" />
      ) : (
        <Bookmark size={size} />
      )}
    </button>
  );
}

export default BookmarkButton;
