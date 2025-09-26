"use client";
import { useState, useEffect } from "react";
import { Grid3X3, Plus } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import ProductCard from "@/components/product/ProductCard";
import Header from "@/components/Header/Header";
import ProductForm from "@/components/product/ProductForm";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image: string;
  createdAt?: string;
}
interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    // Optional: send DELETE request to backend
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch("/api/product", {
        method: editingProduct ? "PUT" : "POST",
        body: formData,
      });
      const savedProduct = await res.json();

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        );
        toast.success("Product updated successfully");
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
        toast.success("Product created successfully");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        icon={Grid3X3}
        title="Products"
        buttonIcon={Plus}
        onButtonClick={handleCreate}
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No products available.</p>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onCancel={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
