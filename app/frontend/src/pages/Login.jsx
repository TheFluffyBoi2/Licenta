import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email and/or password.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/85 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Welcome Back!
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
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-semibold text-gray-700 ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <span className="relative z-10">Sign In</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            setError("");
            try {
              await googleLogin(credentialResponse.credential);
              navigate("/");
            } catch (err) {
              const serverError =
                err.response?.data?.message ||
                err.response?.data ||
                "An error occurred";
              setError(
                typeof serverError === "object"
                  ? serverError.title
                  : serverError,
              );
            }
          }}
          onError={() => setError("Google login failed")}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="384px"
          logo_alignment="left"
        />

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#FF4D4D] font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600">
          Forgot password?{" "}
          <Link
            to="/forgot-password"
            className="text-[#FF4D4D] font-bold hover:underline"
          >
            Reset here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
