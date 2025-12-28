"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Store,
  CheckCircle,
  XCircle,
  Edit,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

function SellerProfilePage() {
  const { user } = useAuth();
  const [storeCount, setStoreCount] = useState<number | null>(null);
  const [loadingStores, setLoadingStores] = useState(true);

  const getStores = async () => {
    try {
      const res = await fetch("/api/sellerprofile", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch store count");

      const data = await res.json();
      setStoreCount(data.storeCount);
      setLoadingStores(false);
    } catch (error) {
      console.error("Error fetching store count:", error);
    } finally {
      setLoadingStores(false);
    }
  };
  useEffect(() => {
    getStores();
  }, []);

  const handleEditProfile = () => {};

  const handleManageStores = () => {};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.name || "Seller Profile"}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-base text-gray-900">
                    {user.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="mt-1 text-base text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.userType || "Seller"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Business Information
              </h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Store className="h-5 w-5 text-gray-400 mt-0.5" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Number of Stores
                  </p>
                  <p className="mt-1 text-base text-gray-900">{storeCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            </div>
            <div className="px-6 py-6">
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Links
              </h2>
            </div>
            <div className="px-6 py-6">
              <button
                onClick={handleManageStores}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Manage Stores
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfilePage;
