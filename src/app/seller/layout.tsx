"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Package,
  Grid3X3,
  ClipboardList,
  User,
  Menu,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      href: "/seller/dashboard",
    },
    {
      id: "products",
      icon: Package,
      label: "Products",
      href: "/seller/products",
    },
    {
      id: "categories",
      icon: Grid3X3,
      label: "Categories",
      href: "/seller/categories",
    },
    {
      id: "orders",
      icon: ClipboardList,
      label: "Orders",
      href: "/seller/orders",
    },
    { id: "profile", icon: User, label: "Profile", href: "/seller/profile" },
  ];

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const Sidebar: React.FC = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Multicart</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4 px-2">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="w-full flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            onClick={() => setSidebarOpen(false)} // close drawer on mobile
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 flex-shrink-0">
        <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Topbar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Multimart</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
