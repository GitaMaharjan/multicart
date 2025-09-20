"use client";

import { useEffect, useState } from "react";
import { Plus, Grid3X3 } from "lucide-react";
import CategoryCard from "@/components/Category/CategoryCard";
import CategoryForm from "@/components/Category/CategoryForm";
import Modal from "@/components/Category/Modal";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  description?: string;
}

const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [categories, setCategories] = useState<Category[]>([]);

  // Open modal to add new category
  const handleAdd = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch categories on page load
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }
      const newCategory = await response.json();
      console.log("Created category:", newCategory);

      setCategories((prev) => [newCategory, ...prev]);
      setShowForm(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-10 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Grid3X3 className="w-7 h-7 text-indigo-500" />
            Categories
          </h1>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mt-2 mb-3"></div>
        </div>

        {/* Add Category Button */}
        <div className="relative flex flex-col items-center group">
          <button
            onClick={handleAdd}
            className="flex items-center justify-center px-5 py-2 rounded-full border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
          </button>
          <span className="mt-1 text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Add Category
          </span>
        </div>
      </div>
      <div>
        {categories.map((category) => (
          <ul key={category.id}>
            <li>{category.name}</li>
          </ul>
        ))}
      </div>
      {/* Categories Grid  */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div> */}

      {/* Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? "Edit Category" : "Add New Category"}
      >
        <CategoryForm
          initialData={selectedCategory ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedCategory(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;
