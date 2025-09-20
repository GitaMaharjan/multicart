"use client";

import { LucideIcon } from "lucide-react";

interface HeaderProps {
  icon: LucideIcon; // pass any lucide-react icon
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  isLoading?: boolean;
  onButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  buttonLabel,
  isLoading = false,
  onButtonClick,
}) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-2xl transition-shadow duration-300 ease-out">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-tr from-blue-400 to-purple-500 p-3 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-110">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side (button) */}
        {buttonLabel && onButtonClick && (
          <button
            onClick={onButtonClick}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{buttonLabel}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
