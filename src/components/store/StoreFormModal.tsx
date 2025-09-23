"use client";

import { Plus, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StoreModalProps {
  isOpen: boolean;
  isLoading: boolean;
  formData: {
    name: string;
    description: string;
  };
  user?: {
    firstName: string;
    lastName: string;
  };
  isEdit?: boolean;
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
  user,
  isEdit = false,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 w-full max-w-lg mx-2 shadow-2xl"
          >
            <div className="relative text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isEdit ? "Edit Store" : "Create Store"}
              </h3>
              {/* Close button */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            {/* Body */}
            <div className="space-y-6">
              {/* Store Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700"
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
                  placeholder="Enter your store name"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-shadow shadow-sm hover:shadow-md disabled:bg-gray-50"
                />
              </div>

              {/* Store Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700"
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
                  placeholder="Describe what your store sells and what makes it unique..."
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-shadow shadow-sm hover:shadow-md disabled:bg-gray-50"
                />
              </div>

              {/* Seller Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                <Store className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">
                    Store Owner
                  </h4>
                  <p className="text-sm text-blue-900">
                    {`${user?.firstName} ${user?.lastName}`}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!formData.name.trim() || isLoading}
                  className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isLoading
                      ? isEdit
                        ? "Updating..."
                        : "Creating..."
                      : isEdit
                      ? "Update Store"
                      : "Create Store"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreFormModal;
