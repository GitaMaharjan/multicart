"use client";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt?: string;
  image?: string;
}

interface ProductFormProps {
  initialData?: Product | null;
  categories: { id: string; name: string }[];
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        categoryId: initialData.categoryId,
      });
    } else {
      setForm({ name: "", price: "", stock: "", categoryId: "" });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoryId: form.categoryId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {initialData ? "Update Product" : "Create New Product"}
      </h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Product Name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          required
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {initialData ? "Update" : "Create"} Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
