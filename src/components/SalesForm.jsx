import React, { useState } from "react";

export default function SalesForm({ items, onSubmit, onClose }) {
  const [newSale, setNewSale] = useState({
    itemId: "",
    quantity: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newSale.itemId) errors.itemId = "Item is required";
    if (newSale.quantity <= 0) errors.quantity = "Quantity must be greater than 0";
    if (!newSale.date) errors.date = "Date is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...newSale,
        date: new Date(newSale.date),
      });
      setNewSale({
        itemId: "",
        quantity: 0,
        date: new Date().toISOString().split("T")[0],
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <select
              value={newSale.itemId}
              onChange={(e) => setNewSale({ ...newSale, itemId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={newSale.quantity}
              onChange={(e) => setNewSale({ ...newSale, quantity: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newSale.date}
              onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              aria-label="Add Sale"
            >
              Add Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
