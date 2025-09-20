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
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {store.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 truncate">
              {store.description || "No description provided"}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>{store.productsCount} products</span>
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                  store.status
                )}`}
              >
                {store.status}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t pt-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Categories</p>
              <p className="font-semibold">{store.categoriesCount}</p>
            </div>
            <div>
              <p className="text-gray-500">Revenue</p>
              <p className="font-semibold text-green-600">
                ${(store.totalSales ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <button
              onClick={() => onView(store.id)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => onEdit(store.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm font-medium cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onSettings(store.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm font-medium cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
          <button
            onClick={() => onDelete(store.id)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 disabled:text-red-400 p-1 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 rounded-b-lg">
        Created {new Date(store.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default StoreCard;
