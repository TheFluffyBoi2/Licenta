import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, cancelRegister } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, username, password);
      setIsSubmitted(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed.";
      setError(errorMsg);
      console.error(err);
    }
  };

  const cancelSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPassword("");
    try {
      await cancelRegister(email);
      setIsSubmitted(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Cancelation failed.";
      setError(errorMsg);
      console.error(err);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center space-y-6 border border-white/20">
          <div className="text-6xl animate-bounce">📩</div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Check your email!
          </h2>
          <p className="text-gray-600 text-lg">
            We've sent a verification link to{" "}
            <span className="font-bold text-gray-800">{email}</span>.
          </p>
          <p className="text-sm text-gray-500">
            Please verify your account before logging in.
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
          <button
            onClick={cancelSubmit}
            className="w-full py-3 rounded-xl text-gray-600 font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Wrong email? Go back
          </button>
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
          Create Account
        </h2>

        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="relative w-full overflow-hidden group font-bold py-3.5 rounded-xl text-white bg-[#444] transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#FF4D4D] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

          <span className="relative z-10">Register</span>
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#FF4D4D] font-bold hover:underline"
          >
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
