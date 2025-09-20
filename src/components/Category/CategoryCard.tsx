"use client";

import { Edit2, Grid3X3, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface Product {
  id: string;
  categoryId: string;
}

interface CategoryCardProps {
  category: Category;
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  products,
  onEdit,
  onDelete,
}) => {
  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      {/* Card Top Row */}
      <div className="flex items-center justify-between mb-5">
        <div className="p-4 bg-gradient-to-tr from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
          <Grid3X3 className="w-6 h-6 text-white" />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit?.(category.id)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete?.(category.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Info */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {category.name}
      </h3>
      <p className="text-gray-600 text-sm mb-5 line-clamp-2">
        {category.description || "No description available."}
      </p>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium shadow-sm">
          {categoryProducts.length} Product
          {categoryProducts.length !== 1 && "s"}
        </span>
        <span className="text-gray-500 text-xs">
          Created: {new Date(category.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
