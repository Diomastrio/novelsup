import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Browse from "./pages/Browse";
import { useThemeStore } from "./store/useThemeStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/Login";
import NovelNestDashboard from "./pages/Dashboard";
import Homepage from "./pages/Home";
import RegisterPage from "./pages/Register";
import Publish from "./pages/Publish";
import CreateNovel from "./pages/CreateNovel";
import EditNovel from "./pages/EditNovel";
import ChaptersList from "./pages/ChaptersList";
import ChapterForm from "./pages/ChapterForm";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const { theme } = useThemeStore();

  // Apply theme on mount and whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="min-h-screen transition-colors duration-300"
        data-theme={theme}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<NovelNestDashboard />} />
          <Route path="/create-novel" element={<CreateNovel />} />
          <Route path="/novel/:id/edit" element={<EditNovel />} />
          <Route path="/novel/:novelId/chapters" element={<ChaptersList />} />
          <Route path="/novel/:novelId/chapter/new" element={<ChapterForm />} />
          <Route
            path="/novel/:novelId/chapter/:chapterId/edit"
            element={<ChapterForm />}
          />
        </Routes>
        <Toaster />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
