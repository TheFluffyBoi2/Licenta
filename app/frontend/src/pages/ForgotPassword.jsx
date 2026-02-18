import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);

      let errorMessage = "Failed to reset password.";

      if (err.response) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.title) {
          errorMessage = err.response.data.title;
        }
      }

      setError(errorMessage);
    }
  };

  if (isSubmitted) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-linear-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
        <div class="w-full max-w-md bg-white/90 dark:bg-[#343434]/95 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center space-y-6 border border-white/20">
          <div class="text-6xl animate-bounce">♻️</div>
          <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white">
            Check your email!
          </h2>
          <p class="text-gray-600 text-lg dark:text-[#EDF2F7]">
            We've sent a reset link to{" "}
            <span class="font-bold text-gray-800 dark:text-[#FF4D4D]">
              {email}
            </span>
            .
          </p>
          <p class="text-sm text-gray-500 italic dark:text-[#EDF2F7]">
            Don't see it? Check your spam folder.
          </p>
          <Link
            to="/login"
            class="inline-block w-full py-3.5 rounded-xl dark:text-[#343434] dark:bg-[#EDF2F7] dark:hover:bg-white text-white font-bold bg-[#444] hover:bg-[#222] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-linear-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
      <form
        onSubmit={handleSubmit}
        class="w-full max-w-md bg-white/85 dark:bg-[#343434]/90 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 class="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          Forgot Your Password?
        </h2>
        {error && (
          <p class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </p>
        )}
        <div class="space-y-4">
          <div class="flex flex-col gap-1.5">
            <label
              class="text-sm font-semibold text-gray-700 dark:text-white ml-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              class="w-full px-4 py-3 rounded-xl border dark:text-white border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          class="relative cursor-pointer w-full overflow-hidden group font-bold py-3.5 rounded-xl dark:bg-white dark:text-[#343434] text-white bg-[#444] transition-all"
        >
          <span class="absolute inset-0 w-full h-full bg-linear-to-tr from-[#FF4D4D] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

          <span class="relative z-10">Reset</span>
        </button>

        <p class="text-center text-sm text-gray-600 dark:text-[#EDF2F7]">
          Don't have an account?{" "}
          <Link
            to="/register"
            class="text-[#FF4D4D] dark:text-[#4DFFBC] font-bold hover:underline cursor-pointer"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
