import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Book, Search, Filter, Loader, Clock, User } from "lucide-react";
import supabase from "../services/supabaseClient";
import BookmarkButton from "../components/BookmarkButton";

function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [genres, setGenres] = useState([]);

  // Fetch published novels
  const { data: novels, isLoading } = useQuery({
    queryKey: ["publishedNovels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select(
          `
          *,
          profiles:author_id(nickname)
        `
        )
        .eq("published", true)
        .order("updated_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Extract unique genres for filter
  useEffect(() => {
    if (novels) {
      const uniqueGenres = [
        ...new Set(novels.map((novel) => novel.genre).filter(Boolean)),
      ];
      setGenres(uniqueGenres);
    }
  }, [novels]);

  // Filter novels based on search and filters
  const filteredNovels = novels?.filter((novel) => {
    const matchesSearch =
      !searchTerm ||
      novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      novel.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = !selectedGenre || novel.genre === selectedGenre;
    const matchesStatus = !selectedStatus || novel.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Novels</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-75">
            Discover amazing stories from talented authors
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow max-w-2xl">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search novels by title or description..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="select select-bordered rounded-xl"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered rounded-xl"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="hiatus">On Hiatus</option>
            </select>
          </div>
        </div>

        {/* Novels Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin mr-3" size={24} />
            <span className="text-lg">Loading novels...</span>
          </div>
        ) : filteredNovels?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-600 rounded-xl">
            <Book size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No Novels Found</h3>
            <p className="opacity-75 max-w-md mx-auto">
              {searchTerm || selectedGenre || selectedStatus
                ? "Try adjusting your search or filters to find more novels."
                : "There are no published novels yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNovels.map((novel) => (
              <Link
                to={`/novel/${novel.id}`}
                key={novel.id}
                className="group border border-gray-700 rounded-xl overflow-hidden hover:border-primary transition-all duration-300 flex flex-col"
              >
                <div className="h-64 overflow-hidden bg-gray-800">
                  {novel.cover_image_url ? (
                    <img
                      src={novel.cover_image_url}
                      alt={novel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Book size={48} className="opacity-40" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {novel.title}
                    </h3>
                    <BookmarkButton novelId={novel.id} size={18} />
                  </div>
                  <p className="text-sm opacity-75 line-clamp-3 mb-4 flex-grow">
                    {novel.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <User size={16} className="mr-1 opacity-70" />
                      <span>{novel.profiles?.nickname || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 opacity-70" />
                      <span className="capitalize">{novel.status}</span>
                    </div>
                  </div>
                  {novel.genre && (
                    <div className="mt-3">
                      <span className="px-3 py-1 bg-gray-800 text-xs rounded-full">
                        {novel.genre}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Show count of novels */}
        {filteredNovels && filteredNovels.length > 0 && (
          <div className="mt-8 text-center text-sm opacity-75">
            Showing {filteredNovels.length}{" "}
            {filteredNovels.length === 1 ? "novel" : "novels"}
            {searchTerm || selectedGenre || selectedStatus
              ? " matching your criteria"
              : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;
