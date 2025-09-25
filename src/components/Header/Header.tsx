"use client";
import { LucideIcon } from "lucide-react";

interface HeaderProps {
  icon: LucideIcon; // Main header icon
  title: string; // Header title
  buttonIcon?: LucideIcon; // Optional button icon
  onButtonClick?: () => void; // Optional click handler
}

const Header: React.FC<HeaderProps> = ({
  icon: Icon,
  title,
  buttonIcon: ButtonIcon,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
      {/* Title and underline */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Icon className="w-7 h-7 text-indigo-500" />
          {title}
        </h1>
        <div className="w-20 h-1 bg-indigo-500 rounded-full mt-2 mb-3"></div>
      </div>

      {/* Optional button */}
      {ButtonIcon && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="flex items-center justify-center p-2 rounded-full border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
        >
          <ButtonIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Header;
