"use client";

import { Plus, Store } from "lucide-react";

interface StoreModalProps {
  isOpen: boolean;
  isLoading: boolean;
  formData: {
    name: string;
    description: string;
  };
  currentSeller: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: () => void;
}

const StoreFormModal: React.FC<StoreModalProps> = ({
  isOpen,
  isLoading,
  formData,
  currentSeller,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-10 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Store
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 p-1"
          >
            <Plus className="h-6 w-6 rotate-45" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Store Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Store Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Enter your store name"
              maxLength={100}
            />
          </div>

          {/* Store Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Store Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Describe what your store sells and what makes it unique..."
              maxLength={500}
            />
          </div>

          {/* Seller Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Store className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Store Owner
                </h4>
                <p className="text-sm text-blue-700">
                  {currentSeller.firstName} {currentSeller.lastName}
                </p>
                <p className="text-xs text-blue-600">{currentSeller.email}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!formData.name.trim() || isLoading}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isLoading ? "Creating..." : "Create Store"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreFormModal;
