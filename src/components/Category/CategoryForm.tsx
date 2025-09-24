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
    storeId: string;
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
  storeData = [],
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [storeId, setStoreId] = useState(initialData?.storeId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set default store for create
  useEffect(() => {
    if (!initialData && storeData.length > 0) {
      setStoreId(storeData[0].id);
    }
  }, [storeData, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) {
      setError("Please select a store.");
      return;
    }
    setError("");
    setLoading(true);
    onSubmit({ name, description, storeId });
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
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter category description"
        />
      </div>

      {/* Only show store dropdown if creating */}
      {!initialData && (
        <div className="space-y-2">
          <Label htmlFor="store">Select Store</Label>
          <select
            id="store"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full border rounded-xl p-2"
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
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
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
