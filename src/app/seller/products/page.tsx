"use client";
import { useState } from "react";
import { Grid3X3, Plus } from "lucide-react";
import ProductForm from "@/components/product/ProductForn";
import Modal from "@/components/Modal/Modal";
import ProductCard from "@/components/product/ProductCard";
import Header from "@/components/Header/Header";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: string;
  createdAt?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>([
    { id: "1", name: "Electronics" },
    { id: "2", name: "Clothing" },
    { id: "3", name: "Home" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id: string) =>
    setProducts(products.filter((p) => p.id !== id));

  const handleSubmit = (data: Omit<Product, "id" | "createdAt">) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...data } : p
        )
      );
    } else {
      setProducts([
        ...products,
        {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setShowModal(false);
    setEditingProduct(null);
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
