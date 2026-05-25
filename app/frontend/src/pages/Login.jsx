import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import ThemeButton from "../components/ThemeButton";

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
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        const firstErrorMessage = err.response.data.errors[firstErrorKey][0];
        setError(firstErrorMessage);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError("Invalid email and/or password");
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/85 dark:bg-[#343434]/90 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div className="flex justify-center items-center space-x-5">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
            Welcome Back!
          </h2>
          <ThemeButton />
        </div>
        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </p>
        )}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-semibold text-gray-700 ml-1 dark:text-white"
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
              className="w-full px-4 py-3 dark:text-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-semibold text-gray-700 ml-1 dark:text-white"
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
              className="w-full px-4 py-3 dark:text-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          className="relative cursor-pointer w-full overflow-hidden group font-bold py-3.5 rounded-xl dark:text-[#343434] dark:bg-white text-white bg-[#444] transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-linear-to-tr from-[#FF4D4D] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

          <span className="relative z-10">Sign In</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-400 text-sm font-medium">
            OR
          </span>
          <div className="grow border-t border-gray-300"></div>
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

        <p className="text-center text-sm text-gray-600 dark:text-[#EDF2F7]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#FF4D4D] dark:text-[#4DFFBC] font-bold hover:underline"
          >
            Register here
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 dark:text-[#EDF2F7]">
          Forgot password?{" "}
          <Link
            to="/forgot-password"
            className="text-[#FF4D4D] dark:text-[#4DFFBC] font-bold hover:underline"
          >
            Reset here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
