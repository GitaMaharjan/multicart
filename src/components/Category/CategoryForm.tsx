// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// interface Store {
//   id: string;
//   name: string;
// }

// interface CategoryFormProps {
//   initialData?: {
//     name: string;
//     description?: string;
//     storeId: string;
//   };
//   storeData: Store[];
//   onSubmit: (data: {
//     name: string;
//     description?: string;
//     storeId: string;
//   }) => void;
//   onCancel?: () => void;
// }

// const CategoryForm: React.FC<CategoryFormProps> = ({
//   initialData,
//   storeData = [],
//   onSubmit,
//   onCancel,
// }) => {
//   const [name, setName] = useState(initialData?.name || "");
//   const [description, setDescription] = useState(
//     initialData?.description || ""
//   );
//   const [storeId, setStoreId] = useState(initialData?.storeId || "");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Set default store for create
//   useEffect(() => {
//     if (!initialData && storeData.length > 0) {
//       setStoreId(storeData[0].id);
//     }
//   }, [storeData, initialData]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!storeId) {
//       setError("Please select a store.");
//       return;
//     }
//     setError("");
//     setLoading(true);
//     onSubmit({ name, description, storeId });
//     setLoading(false);
//   };

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-4 bg-white rounded-2xl p-6 shadow-lg"
//     >
//       <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
//         {initialData ? "Update Category" : "Create New Category"}
//       </h2>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Category Name
//         </label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter category name"
//           required
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Description
//         </label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Enter category description"
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       {/* Show store dropdown only if creating */}
//       {!initialData && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Store
//           </label>
//           <select
//             value={storeId}
//             onChange={(e) => setStoreId(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             {storeData.map((store) => (
//               <option key={store.id} value={store.id}>
//                 {store.name}
//               </option>
//             ))}
//           </select>
//           {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       )}

//       <div className="flex justify-end space-x-3 pt-4">
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={loading}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//         )}
//         <button
//           type="submit"
//           disabled={loading}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           {loading
//             ? "Saving..."
//             : initialData
//             ? "Update Category"
//             : "Create Category"}
//         </button>
//       </div>
//     </motion.form>
//   );
// };

// export default CategoryForm;

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Store {
  id: string;
  name: string;
}

interface CategoryFormProps {
  initialData?: { name: string; description?: string; storeId: string };
  storeData: Store[];
  onSubmit: (data: {
    name: string;
    description?: string;
    storeId: string;
  }) => void;
  onCancel: () => void;
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
  const [storeId, setStoreId] = useState(initialData?.storeId || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData && storeData.length > 0) setStoreId(storeData[0].id);
  }, [storeData, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return setError("Please select a store.");
    setError("");
    onSubmit({ name, description, storeId });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {initialData ? "Update Category" : "Create New Category"}
      </h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Category Name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description"
        />
      </div>

      {!initialData && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Store
          </label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {initialData ? "Update" : "Create"} Category
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
