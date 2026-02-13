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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center space-y-6 border border-white/20">
          <div className="text-6xl animate-bounce">♻️</div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Check your email!
          </h2>
          <p className="text-gray-600 text-lg">
            We've sent a reset link to{" "}
            <span className="font-bold text-gray-800">{email}</span>.
          </p>
          <p className="text-sm text-gray-500 italic">
            Don't see it? Check your spam folder.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3.5 rounded-xl text-white font-bold bg-[#444] hover:bg-[#222] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/85 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Forgot Your Password?
        </h2>
        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </p>
        )}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-semibold text-gray-700 ml-1"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          className="relative w-full overflow-hidden group font-bold py-3.5 rounded-xl text-white bg-[#444] transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#FF4D4D] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

          <span className="relative z-10">Reset</span>
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#FF4D4D] font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
