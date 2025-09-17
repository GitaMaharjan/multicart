"use client";
import LoginPage from "@/components/auth/LoginForm";
import SignupPage from "@/components/auth/SignUpForm";
import React, { useState } from "react";

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState<"login" | "signup">("login");

  return (
    <div>
      {/* Page Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex bg-black/30 backdrop-blur-md rounded-full p-1">
          <button
            onClick={() => setCurrentPage("login")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentPage === "login"
                ? "bg-purple-600 text-white"
                : "text-purple-200 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentPage("signup")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentPage === "signup"
                ? "bg-purple-600 text-white"
                : "text-purple-200 hover:text-white"
            }`}
          >
            Signup
          </button>
        </div>
      </div>

      {/* Render selected page */}
      {currentPage === "login" ? <LoginPage /> : <SignupPage />}
    </div>
  );
};

export default AuthPage;
