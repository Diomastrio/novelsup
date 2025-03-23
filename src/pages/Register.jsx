import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../authentication/authHooks";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signup, isLoading } = useSignup();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user changes input
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password requirements (can add more complex validation)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Call the signup function from the hook
    signup({
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password,
      role: "normal", // Default role for new users
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full  rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center  mb-2">
            Create Account
          </h2>
          <p className="text-center  mb-8">Join our community today</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <div>
                  <label
                    htmlFor="nickname"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    NickName
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="" />
                    </div>
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className=" hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with letters and numbers
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className=" hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2  text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 ">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm  text-sm font-medium text-gray-500 hover:bg-gray-50">
                Google
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 50 border-t border-gray-200 flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
