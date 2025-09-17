import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Store,
  Users,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

type UserType = "CUSTOMER" | "SELLER";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  userType: UserType;
}

const SignupPage: FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    userType: "CUSTOMER",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      alert("Signup form submitted!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background and floating elements omitted for brevity, keep original */}

      <div className="w-full max-w-2xl relative z-10 transform hover:scale-105 transition-transform duration-300">
        <form
          className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-200 to-pink-200 bg-clip-text text-transparent">
              Join Our Marketplace!
            </h1>
            <p className="text-purple-200">
              Create your account and start your journey
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6 flex space-x-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, userType: "CUSTOMER" }))
              }
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.userType === "CUSTOMER"
                  ? "border-purple-500 bg-purple-500/20 text-white"
                  : "border-white/30 text-purple-200 hover:border-purple-400 hover:bg-white/10"
              }`}
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Customer</p>
              <p className="text-xs opacity-75">Buy products</p>
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, userType: "SELLER" }))
              }
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.userType === "SELLER"
                  ? "border-pink-500 bg-pink-500/20 text-white"
                  : "border-white/30 text-purple-200 hover:border-pink-400 hover:bg-white/10"
              }`}
            >
              <Store className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Seller</p>
              <p className="text-xs opacity-75">Sell products</p>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300 text-sm"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300 text-sm"
                required
              />
            </div>

            {/* Email & Password */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone (Optional)"
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300 text-sm"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white/15 transition-all duration-300 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-purple-200">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-pink-300 hover:text-pink-200 underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-pink-300 hover:text-pink-200 underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-purple-200">
              Already have an account?{" "}
              <button className="text-pink-300 hover:text-pink-200 font-semibold transition-colors hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
