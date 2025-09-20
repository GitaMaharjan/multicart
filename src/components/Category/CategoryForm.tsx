"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface CategoryFormProps {
  initialData?: {
    name: string;
    description?: string;
  };
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit({ name, description });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-semibold">
          Category Name
        </Label>
        <Input
          id="name"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 rounded-lg transition"
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
          className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 rounded-lg transition"
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="bg-white border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
