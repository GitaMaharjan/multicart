"use client";
import Image from "next/image";
import { Edit2, Trash2, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: string;
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center relative">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 
                   (max-width: 1200px) 50vw, 
                   33vw"
            priority={false}
          />
        ) : (
          <Package className="w-16 h-16 text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">
          ${product.price}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Stock: {product.stock} units
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              product.stock > 20
                ? "bg-green-100 text-green-800"
                : product.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock > 20
              ? "In Stock"
              : product.stock > 0
              ? "Low Stock"
              : "Out of Stock"}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
