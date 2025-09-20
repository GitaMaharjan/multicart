"use client";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={handleContentClick}
        className="bg-white rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100"
      >
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
