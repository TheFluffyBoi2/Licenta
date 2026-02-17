import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState("");

  const hasRequested = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No reset token found in the URL.");
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    const performReset = async () => {
      try {
        const response = await api.get(`api/auth/confirm-reset?token=${token}`);
        setTempPassword(response.data.newPassword);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(
          err.response?.data ||
            "Failed to reset password. The link may have expired.",
        );
      }
    };

    performReset();
  }, [token]);

  return (
    <div class="min-h-screen flex items-center justify-center bg-linear-to-tr from-[#4DFFBC] via-[#FFD700] to-[#FF4D4D] p-6">
      <div class="w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center space-y-6">
        {status === "loading" && (
          <div class="space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 mx-auto"></div>
            <h2 class="text-xl font-bold text-gray-800">
              Generating your new password...
            </h2>
          </div>
        )}

        {status === "success" && (
          <div class="space-y-6 animate-fade-in">
            <div class="text-5xl">🔑</div>
            <h2 class="text-2xl font-bold text-gray-800">
              Password Reset Successful
            </h2>
            <p class="text-gray-600">Your temporary password is:</p>

            <div class="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-yellow-500 relative group">
              <span class="text-2xl font-mono font-bold tracking-widest text-black">
                {tempPassword}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(tempPassword)}
                class="block text-xs mt-2 text-blue-500 hover:underline mx-auto"
              >
                Click to copy
              </button>
            </div>

            <p class="text-xs text-red-500 font-semibold">
              Warning: Please log in and change this password immediately!
            </p>

            <Link
              to="/login"
              class="inline-block w-full py-3 rounded-xl text-white font-bold bg-black hover:bg-gray-800 transition-all"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div class="space-y-4">
            <div class="text-5xl">❌</div>
            <h2 class="text-2xl font-bold text-red-600">Reset Failed</h2>
            <p class="text-gray-600">{error}</p>
            <Link
              to="/forgot-password"
              alt=""
              class="text-yellow-600 font-bold hover:underline"
            >
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
