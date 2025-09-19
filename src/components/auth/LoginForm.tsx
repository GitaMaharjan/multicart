"use client";

import React, { useState, FC, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}
const LoginPage: FC = () => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        router.push(result.redirect || "/home");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="w-full max-w-md relative z-10 transform hover:scale-105 transition-transform duration-300">
        <form
          className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-purple-200">
              Sign in to your marketplace account
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-300 group-focus-within:text-purple-100 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300 group-focus-within:text-purple-100 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-purple-200">
              Dont have an account?{" "}
              <button className="text-pink-300 hover:text-pink-200 font-semibold transition-colors hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
