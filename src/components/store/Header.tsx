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
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        </div>

        {/* Right side (button) */}
        {buttonLabel && onButtonClick && (
          <button
            onClick={onButtonClick}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium"
          >
            <span>{buttonLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
