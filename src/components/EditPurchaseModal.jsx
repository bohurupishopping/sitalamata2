import React, { useState } from "react";
    import { doc, updateDoc, deleteDoc } from "firebase/firestore";
    import { db } from "../firebase";

    export default function EditPurchaseModal({ purchase, categories, items, onClose, onSuccess }) {
      const [editedPurchase, setEditedPurchase] = useState({
        categoryId: purchase.categoryId,
        itemId: purchase.itemId,
        purchaseDate: purchase.purchaseDate.toDate().toISOString().split("T")[0],
        purchaseQty: purchase.purchaseQty,
      });

      const handleUpdatePurchase = async (e) => {
        e.preventDefault();
        try {
          await updateDoc(doc(db, "purchases", purchase.id), {
            ...editedPurchase,
            purchaseDate: new Date(editedPurchase.purchaseDate),
          });
          onSuccess();
          onClose();
        } catch (error) {
          console.error("Error updating purchase:", error);
        }
      };

      const handleDeletePurchase = async () => {
        try {
          await deleteDoc(doc(db, "purchases", purchase.id));
          onSuccess();
          onClose();
        } catch (error) {
          console.error("Error deleting purchase:", error);
        }
      };

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Purchase</h2>
            <form onSubmit={handleUpdatePurchase} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editedPurchase.categoryId}
                  onChange={(e) =>
                    setEditedPurchase({ ...editedPurchase, categoryId: e.target.value })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  value={editedPurchase.itemId}
                  onChange={(e) =>
                    setEditedPurchase({ ...editedPurchase, itemId: e.target.value })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={editedPurchase.purchaseDate}
                  onChange={(e) =>
                    setEditedPurchase({ ...editedPurchase, purchaseDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={editedPurchase.purchaseQty}
                  onChange={(e) =>
                    setEditedPurchase({ ...editedPurchase, purchaseQty: parseInt(e.target.value) })
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleDeletePurchase}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
