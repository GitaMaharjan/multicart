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
  storeId: string;
}
interface Store {
  id: string;
  name: string;
  description?: string;
}

interface CategoryFormData {
  name: string;
  description?: string;
  storeId: string;
}

const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch stores
  const fetchStores = async () => {
    try {
      const res = await fetch("/api/store");
      const data = await res.json();
      setStores(data.stores || []);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      const method = selectedCategory ? "PUT" : "POST";
      console.log("Submitting category:", selectedCategory, data);

      const url = selectedCategory
        ? `/api/category/${selectedCategory.id}`
        : "/api/category";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // send cookies
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "Failed to save category");
      }

      const savedCategory = await res.json();

      if (selectedCategory) {
        // Update category in state
        setCategories((prev) =>
          prev.map((cat) => (cat.id === savedCategory.id ? savedCategory : cat))
        );
      } else {
        setCategories((prev) => [savedCategory, ...prev]);
      }

      setShowForm(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Category save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Grid3X3 className="w-7 h-7 text-indigo-500" />
            Categories
          </h1>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mt-2 mb-3"></div>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center px-5 py-2 rounded-full border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => handleEdit(category)}
          />
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedCategory(null);
          }}
        >
          <CategoryForm
            initialData={selectedCategory || undefined}
            storeData={stores}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedCategory(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default CategoriesPage;
