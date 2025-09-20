"use client";

import React, { useState } from "react";
import { Plus, Store } from "lucide-react";
import StoreFormModal from "@/components/store/StoreFormModal";
import Header from "@/components/store/Header";
import StoreCard from "@/components/store/Storecard";

// Types based on your Prisma schema
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

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
  // Mock current seller data (in real app, this would come from authentication/context)
  const currentSeller: User = {
    id: "user123",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };

  const [stores, setStores] = useState<Store[]>([
    {
      id: "clh1k2j3l4m5n",
      name: "TechWorld Electronics",
      description: "Latest electronics and gadgets for tech enthusiasts",
      sellerId: "user123",
      categoriesCount: 5,
      productsCount: 42,
      totalSales: 15420,
      monthlyRevenue: 3200,
      status: "Active",
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10",
    },
    {
      id: "clh1k2j3l4m5o",
      name: "John's Gaming Store",
      description: "Premium gaming accessories and peripherals",
      sellerId: "user123",
      categoriesCount: 3,
      productsCount: 28,
      totalSales: 8900,
      monthlyRevenue: 1850,
      status: "Active",
      createdAt: "2024-01-20",
      updatedAt: "2024-02-08",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Only show stores belonging to current seller
  const myStores: Store[] = stores.filter(
    (store) => store.sellerId === currentSeller.id
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStore = async (): Promise<void> => {
    if (!formData.name.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newStore: Store = {
      id: `clh${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      sellerId: currentSeller.id,
      categoriesCount: 0,
      productsCount: 0,
      totalSales: 0,
      monthlyRevenue: 0,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setStores((prev) => [...prev, newStore]);
    setFormData({ name: "", description: "" });
    setShowAddModal(false);
    setIsLoading(false);
  };

  const handleDeleteStore = async (storeId: string): Promise<void> => {
    if (
      window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone."
      )
    ) {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStores((prev) => prev.filter((store) => store.id !== storeId));
      setIsLoading(false);
    }
  };

  //   const handleEditStore = (storeId: string): void => {
  //     console.log("Edit store:", storeId);
  //   };

  //   const handleViewStore = (storeId: string): void => {
  //     console.log("View store:", storeId);
  //   };

  //   const handleStoreSettings = (storeId: string): void => {
  //     console.log("Store settings:", storeId);
  //   };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          icon={Store}
          title="My Stores"
          subtitle={`Welcome back, ${currentSeller.firstName}! Manage your stores and track performance`}
          buttonLabel="Create New Store"
          isLoading={isLoading}
          onButtonClick={() => setShowAddModal(true)}
        />
      </div>

      {/* {myStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myStores.map((store: Store) => (
            <StoreCard
              key={store.id}
              store={store}
              isLoading={isLoading}
              onView={handleViewStore}
              onEdit={handleEditStore}
              onSettings={handleStoreSettings}
              onDelete={handleDeleteStore}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Store className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No stores yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first store to showcase your products.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Store</span>
          </button>
        </div>
      )} */}

      {/* Store Form Modal */}
      <StoreFormModal
        isOpen={showAddModal}
        isLoading={isLoading}
        formData={formData}
        currentSeller={currentSeller}
        onClose={() => setShowAddModal(false)}
        onChange={handleInputChange}
        onSubmit={handleAddStore}
      />
    </div>
  );
};

export default SellerStoreDashboard;
