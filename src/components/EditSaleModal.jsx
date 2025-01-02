import React, { useState } from "react";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditSaleModal({ sale, items, onClose, onSuccess }) {
  const [editedSale, setEditedSale] = useState({
    itemId: sale.itemId,
    quantity: sale.quantity,
    date: sale.date?.toDate ? sale.date.toDate().toISOString().split("T")[0] : new Date(sale.date).toISOString().split("T")[0],
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "sales", sale.id), {
        ...editedSale,
        date: new Date(editedSale.date),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "sales", sale.id));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Sale</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <select
              value={editedSale.itemId}
              onChange={(e) => setEditedSale({ ...editedSale, itemId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={editedSale.quantity}
              onChange={(e) => setEditedSale({ ...editedSale, quantity: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={editedSale.date}
              onChange={(e) => setEditedSale({ ...editedSale, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleDelete}
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
