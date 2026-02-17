import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }

    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verifyToken = async () => {
      try {
        await api.get(`api/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The token might be expired.",
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div class="min-h-screen flex items-center justify-center bg-linear-to-tr from-[#FF4D4D] via-[#FFD700] to-[#4DFFBC] p-6">
      <div class="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center space-y-6">
        {status === "verifying" && (
          <>
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FFD700] border-solid mx-auto"></div>
            <h2 class="text-2xl font-bold text-gray-800">
              Verifying your email...
            </h2>
          </>
        )}

        {status === "success" && (
          <>
            <div class="text-6xl">🎉</div>
            <h2 class="text-2xl font-bold text-gray-800">Email Verified!</h2>
            <p class="text-gray-600">
              Your account has been successfully verified.
            </p>
            <Link
              to="/login"
              class="inline-block w-full py-3 rounded-xl text-white font-bold bg-[#444] hover:bg-black transition-all mt-4"
            >
              Login Now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div class="text-6xl">⚠️</div>
            <h2 class="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p class="text-gray-600">{message}</p>
            <Link
              to="/register"
              class="inline-block text-[#FF4D4D] font-bold hover:underline mt-4"
            >
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
