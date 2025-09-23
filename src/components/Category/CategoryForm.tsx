"use client";

import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface Store {
  id: string;
  name: string;
}

interface CategoryFormProps {
  initialData?: {
    name: string;
    description?: string;
  };
  storeData: Store[];
  onSubmit: (data: {
    name: string;
    description?: string;
    storeId: string;
  }) => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  storeData,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [selectStoreId, setSelectStoreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set default store
  useEffect(() => {
    if (!initialData && storeData.length > 0) {
      setSelectStoreId(storeData[0].id);
    }
  }, [storeData, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && !selectStoreId) {
      setError("Please select a store before creating a category.");
      return;
    }
    setError("");
    setLoading(true);
    await onSubmit({ name, description, storeId: selectStoreId });
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-3xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {initialData ? "Update Category" : "Create New Category"}
      </h2>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-semibold">
          Category Name
        </Label>
        <Input
          id="name"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700 font-semibold">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter category description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        />
      </div>

      {!initialData && (
        <div className="space-y-2">
          <Label htmlFor="store" className="text-gray-700 font-semibold">
            Select Store
          </Label>
          <select
            id="store"
            value={selectStoreId}
            onChange={(e) => setSelectStoreId(e.target.value)}
            className="w-full border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md p-2"
          >
            {storeData.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="bg-white border-gray-300 hover:bg-gray-100 text-gray-700 shadow-md transition-transform transform hover:-translate-y-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform transform hover:-translate-y-1"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </motion.form>
  );
};

export default CategoryForm;
