import React from "react";
import { Book, Edit, Trash2, Plus, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserNovels, useDeleteNovel } from "../services/novelHooks";
import { formatDistanceToNow } from "date-fns";

const NovelNestDashboard = () => {
  const { data: novels, isLoading, isError } = useUserNovels();
  const { deleteNovel, isLoading: isDeleting } = useDeleteNovel();

  const handleDeleteNovel = (id) => {
    if (
      confirm(
        "Are you sure you want to delete this novel? This action cannot be undone."
      )
    ) {
      deleteNovel(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <Link
              to="/create-novel"
              className="flex items-center px-4 py-2 rounded bg-primary text-primary-content hover:bg-primary-focus"
            >
              <Plus size={18} className="mr-2" />
              Add New Novel
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-800 mb-8">
            <button className="pb-4 border-b-2 border-primary font-medium">
              Novels
            </button>
            <button className="pb-4 opacity-70">Chapters</button>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Manage Novels</h2>
            <p className="mb-8">
              Create, edit, or delete novels from your collection.
            </p>

            {/* Novel List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin mr-2" />
                <span>Loading your novels...</span>
              </div>
            ) : isError ? (
              <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
                Error loading novels. Please try again.
              </div>
            ) : novels?.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                <Book size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No Novels Yet</h3>
                <p className="mb-4">You haven't created any novels yet.</p>
                <Link to="/create-novel" className="btn btn-primary">
                  Create Your First Novel
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {novels.map((novel) => (
                  <div
                    key={novel.id}
                    className="flex justify-between items-center p-4 border border-gray-700 rounded-lg hover:border-gray-500 transition-all"
                  >
                    <div className="flex items-center">
                      <div className="h-16 w-12 mr-4 overflow-hidden rounded">
                        {novel.cover_image_url ? (
                          <img
                            src={novel.cover_image_url}
                            alt={novel.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                            <Book size={24} className="opacity-50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">{novel.title}</h3>
                        <p className="text-gray-400">
                          {novel.status} • Updated{" "}
                          {formatDistanceToNow(new Date(novel.updated_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/novel/${novel.id}/chapters`}
                        className="flex items-center px-4 py-2 rounded hover:bg-gray-800"
                      >
                        <Book className="mr-2" size={18} />
                        Chapters
                      </Link>
                      <Link
                        to={`/novel/${novel.id}/edit`}
                        className="flex items-center px-4 py-2 rounded hover:bg-gray-800"
                      >
                        <Edit className="mr-2" size={18} />
                        Edit
                      </Link>
                      <button
                        className="flex items-center px-4 py-2 rounded hover:bg-gray-800"
                        onClick={() => handleDeleteNovel(novel.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2" size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NovelNestDashboard;
