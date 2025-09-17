import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Store,
  Users,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";

type UserType = "CUSTOMER" | "SELLER";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    userType: "CUSTOMER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    // We'll return a single error object with the first encountered error
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      return newErrors;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      return newErrors;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      return newErrors;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      return newErrors;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      return newErrors;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      return newErrors;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Password mismatch", {
        description: "Passwords do not match",
      });
      return newErrors;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      return newErrors;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
      return newErrors;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      return newErrors;
    }

    const termsCheckbox = document.getElementById(
      "terms"
    ) as HTMLInputElement | null;
    if (termsCheckbox && !termsCheckbox.checked) {
      toast.error("Terms not accepted", {
        description: "You must accept the Terms and Privacy Policy",
      });
      return {}; // no field-specific error, just toast
    }

    return {}; // no errors
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate client-side first
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show toast for server-side errors
        const errorMessage = data.message || "Something went wrong";

        if (errorMessage.includes("already exists")) {
          toast.error("Sign up failed", {
            description: "User already exists",
          });
        } else {
          toast.error("Sign up failed", {
            description: errorMessage,
          });
        }

        setIsLoading(false);
        return;
      }

      toast.success("Signup Successful", {
        description: "Your account has been created",
      });
      // Reset all fields
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        gender: "",
        userType: "CUSTOMER",
      });

      // router.push("/login");
    } catch (err) {
      toast.error("Signup Failed", {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      <Toaster position="top-center" richColors />

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
              <div className="flex flex-col">
                <div className="min-h-[1rem]">
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                  )}
                </div>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
                />
              </div>

              <div className="flex flex-col">
                <div className="min-h-[1rem]">
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mb-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <div className="min-h-[1rem]">
                {errors.email && (
                  <p className="text-red-500 text-xs mb-1">{errors.email}</p>
                )}
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <div className="min-h-[1rem]">
                {errors.password && (
                  <p className="text-red-500 text-xs mb-1">{errors.password}</p>
                )}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-3 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <div className="min-h-[1rem]">
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mb-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-3 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="min-h-[1rem]">
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mb-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone (Optional)"
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
                />
              </div>

              <div className="flex flex-col">
                <div className="min-h-[1rem]">
                  {errors.gender && (
                    <p className="text-red-500 text-xs mb-1">{errors.gender}</p>
                  )}
                </div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-purple-200">
              Already have an account?{" "}
              <button className="text-pink-300 hover:text-pink-200 font-semibold underline">
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
