import React from "react";
import { ChevronRight, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Book } from "lucide-react";
import { Link } from "react-router-dom";
export default function Homepage() {
  return (
    //   <Navbar />
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold mb-4 pt-8">Welcome to NovelNest</h1>
      <p className="text-xl max-w-2xl mb-8">
        Your digital library for reading and sharing novels. Sign up to start
        reading or contribute your own stories.
      </p>
      <div className="flex space-x-4 pb-20 mb-16 pt-8">
        <Link
          to="/browse"
          className="flex items-center px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition"
        >
          Browse Novels
          <ChevronRight size={16} className="ml-2" />
        </Link>
        <Link
          to="/login"
          className="flex items-center px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition"
        >
          Sign In
          <BookOpen size={16} className="ml-2" />
        </Link>
      </div>
      <div className="mb-8 md:mb-0 w-fit text-center p-6 rounded-lg border border-gray-800 shadow-lg">
        <div className="flex items-center justify-center mb-3">
          <Book className="mr-2 text-purple-400" size={24} />
          <h2 className="text-2xl font-bold">NovelNest</h2>
        </div>
        <p className=" max-w-2xl mx-auto">
          A platform for reading and sharing novel chapters. Join our community
          of readers and writers today.
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-[150%] max-w-[1500px] overflow-x-auto py-8 my-6">
          <div className=" p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2 text-indigo-400" size={20} />
              For Readers
            </h3>
            <p className="">
              Discover new novels, bookmark your favorites, and enjoy a seamless
              reading experience across all your devices. Get personalized
              recommendations based on your reading history.
            </p>
          </div>

          <div className=" p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Book className="mr-2 text-emerald-400" size={20} />
              For Writers
            </h3>
            <p className="">
              Share your stories with the world. Upload chapters, edit content,
              and build your audience. Track reader engagement and receive
              valuable feedback on your work.
            </p>
          </div>

          <div className=" p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ChevronRight className="mr-2 text-amber-400" size={20} />
              Easy to Use
            </h3>
            <p className="">
              Intuitive interface with search functionality, pagination, and
              mobile-friendly design for reading on the go. Customize your
              reading experience with font and theme options.
            </p>
          </div>
        </div>
      </div>
    </main>

    //   <Footer />
  );
}
