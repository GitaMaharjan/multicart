"use client";

import { useEffect, useState } from "react";
import { Plus, Grid3X3, Layers } from "lucide-react";
import CategoryCard from "@/components/Category/CategoryCard";
import CategoryForm from "@/components/Category/CategoryForm";
import Modal from "@/components/Modal/Modal";
import { toast } from "sonner";
import Header from "@/components/Header/Header";

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

  const handleDelete = async (category: Category) => {
    try {
      const response = await fetch(`/api/category/${category.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error(error.message || "Failed to delete category");
      }
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== category.id)
      );
      toast.success("Category deleted successfully");
    } catch (error) {
      console.log(error);
    }
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
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "Failed to save category");
      }

      const savedCategory = await res.json();

      if (selectedCategory) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === savedCategory.id ? savedCategory : cat))
        );
        toast.success("Category updated successfully!");
      } else {
        setCategories((prev) => [savedCategory, ...prev]);
        toast.success("Category created successfully!");
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
      <Header
        icon={Layers}
        title="Categories"
        buttonIcon={Plus}
        onButtonClick={handleAdd}
      />

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => handleEdit(category)}
              onDelete={() => handleDelete(category)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          No categories found. Click the + button to add one.
        </p>
      )}

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
