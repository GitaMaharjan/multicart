"use client";
import React, { FC, useState } from "react";
import {
  Eye,
  EyeOff,
  Store,
  Users,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
      error: "Please select your gender",
    }),
    userType: z.enum(["CUSTOMER", "SELLER"]),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      gender: (undefined as unknown) as SignupFormData["gender"],
      userType: "CUSTOMER",
      termsAccepted: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (formData: SignupFormData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Sign up failed", {
          description: data.message || "Something went wrong",
        });
        return;
      }
      toast.success("Signup Successful", {
        description: "Your account has been created",
      });
      reset();
    } catch (err) {
      toast.error("Signup Failed", { description: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="w-full max-w-2xl relative z-10 transform hover:scale-105 transition-transform duration-300">
        <form
          className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300"
          onSubmit={handleSubmit(onSubmit)}
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
            {(["CUSTOMER", "SELLER"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("userType", type)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                  watch("userType") === type
                    ? type === "CUSTOMER"
                      ? "border-purple-500 bg-purple-500/20 text-white"
                      : "border-pink-500 bg-pink-500/20 text-white"
                    : "border-white/30 text-purple-200 hover:border-purple-400 hover:bg-white/10"
                }`}
              >
                {type === "CUSTOMER" ? (
                  <>
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Customer</p>
                    <p className="text-xs opacity-75">Buy products</p>
                  </>
                ) : (
                  <>
                    <Store className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Seller</p>
                    <p className="text-xs opacity-75">Sell products</p>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Last Name"
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <input
                type="email"
                {...register("email")}
                placeholder="Email Address"
                className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full pl-3 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className="w-full pl-3 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="Phone"
                  className="w-full pl-3 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <select
                  {...register("gender")}
                  defaultValue=""
                  className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                >
                  <option className="text-black" value="">
                    Select Gender
                  </option>
                  <option className="text-black" value="MALE">
                    Male
                  </option>
                  <option className="text-black" value="FEMALE">
                    Female
                  </option>
                  <option className="text-black" value="OTHER">
                    Other
                  </option>
                  <option className="text-black" value="PREFER_NOT_TO_SAY">
                    Prefer not to say
                  </option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register("termsAccepted")}
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
            {errors.termsAccepted && (
              <p className="mt-1 text-xs text-red-500">
                {errors.termsAccepted.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
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
