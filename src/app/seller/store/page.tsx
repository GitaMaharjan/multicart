"use client";

import React, { useEffect, useState } from "react";
import StoreFormModal from "@/components/store/StoreFormModal";
import Header from "@/components/store/Header";
import { Store } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Jwt from "jsonwebtoken";
import StoreCard from "@/components/store/StoreCard";

interface Store {
  id: string;
  name: string;
  description: string | null;
  sellerId: string;
  categoriesCount: number;
  productsCount: number;
  totalSales: number;
  monthlyRevenue: number;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface StoreFormData {
  name: string;
  description: string;
}

const SellerStoreDashboard: React.FC = () => {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  }>();
  const [stores, setStores] = useState<Store[]>([]);
  const [editStore, setEditStore] = useState<Store | null>(null);

  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Submitting store:", formData);

    try {
      const url = editStore ? `/api/store/${editStore.id}` : "/api/store";
      const method = editStore ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        console.log(err);
        throw new Error(
          editStore ? "Failed to update store" : "Failed to create store"
        );
      }
      const storeData = await response.json();

      if (editStore) {
        setStores((prev) =>
          prev.map((s) => (s.id === storeData.id ? storeData : s))
        );
      } else {
        setStores((prev) => [...prev, storeData]);
      }

      setFormData({ name: "", description: "" });
      setShowAddModal(false);
      setEditStore(null);
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;
    setEditStore(store);
    setFormData({ name: store.name, description: store.description || "" });
    setShowAddModal(true);
  };

  const fetchStores = async () => {
    try {
      const res = await fetch("/api/store", {
        credentials: "include",
      });

      if (res.status == 401) {
        router.push("/auth");
        return;
      }
      const data = await res.json();
      setStores(data.stores);
      setUser(data.user);
    } catch (error) {
      console.error(error);
      router.push("/auth");
    }
  };

  // Fetch categories on page load
  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          icon={Store}
          title="My Stores"
          subtitle={`Welcome back, ${
            user ? user.firstName : "seller"
          }! Manage your stores and track performance`}
          buttonLabel="Create New Store"
          isLoading={isLoading}
          onButtonClick={() => {
            setEditStore(null); // important
            setFormData({ name: "", description: "" });
            setShowAddModal(true);
          }}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onView={(id) => console.log("View store", id)}
              onEdit={handleEditStore}
              onDelete={(id) =>
                setStores((prev) => prev.filter((s) => s.id !== id))
              }
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No stores found. Create your first store!
          </p>
        )}
      </div>

      {/* Store Form Modal */}
      <StoreFormModal
        isOpen={showAddModal}
        isLoading={isLoading}
        formData={formData}
        user={user}
        isEdit={!!editStore}
        onClose={() => {
          setShowAddModal(false);
          setEditStore(null); // clear edit mode
          setFormData({ name: "", description: "" }); // clear form
        }}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SellerStoreDashboard;
