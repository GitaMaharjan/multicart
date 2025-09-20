"use client";

import { Edit, Eye, Package, Settings, Trash2 } from "lucide-react";

interface Store {
  id: string;
  name: string;
  description?: string | null;
  productsCount: number;
  categoriesCount: number;
  totalSales: number;
  status: string;
  createdAt: string;
}

interface StoreCardProps {
  store: Store;
  isLoading?: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onSettings: (id: string) => void;
  onDelete: (id: string) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isLoading = false,
  onView,
  onEdit,
  onSettings,
  onDelete,
}) => {
  const getStatusClasses = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-out group overflow-hidden">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>

      <div className="p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate hover:text-blue-600 transition-colors">
            {store.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {store.description || "No description provided"}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Package className="h-4 w-4 text-gray-400" />
              <span>{store.productsCount} products</span>
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                store.status
              )}`}
            >
              {store.status}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="text-gray-400">Categories</p>
              <p className="font-medium">{store.categoriesCount}</p>
            </div>
            <div>
              <p className="text-gray-400">Revenue</p>
              <p className="font-medium text-green-500">
                ${(store.totalSales ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 border-t pt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => onView(store.id)}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => onEdit(store.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onSettings(store.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
          <button
            onClick={() => onDelete(store.id)}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 disabled:text-red-300 p-1 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 rounded-b-xl border-t">
        Created {new Date(store.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default StoreCard;
