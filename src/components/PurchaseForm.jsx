import React, { useState, useEffect } from "react";
    import { collection, addDoc, getDocs } from "firebase/firestore";
    import { db } from "../firebase";

    export default function PurchaseForm({ onSuccess }) {
      const [categories, setCategories] = useState([]);
      const [items, setItems] = useState([]);
      const [newPurchase, setNewPurchase] = useState({
        categoryId: "",
        itemId: "",
        purchaseQty: 0,
        purchaseDate: new Date().toISOString().split("T")[0],
      });
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
      const [isItemModalOpen, setIsItemModalOpen] = useState(false);
      const [newCategoryName, setNewCategoryName] = useState("");
      const [newItemName, setNewItemName] = useState("");

      useEffect(() => {
        fetchCategories();
      }, []);

      const fetchCategories = async () => {
        const querySnapshot = await getDocs(collection(db, "categories"));
        setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const fetchItems = async (categoryId) => {
        const querySnapshot = await getDocs(collection(db, "items"));
        const filteredItems = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.categoryId === categoryId);
        setItems(filteredItems);
      };

      const handleAddPurchase = async (e) => {
        e.preventDefault();

        // Add purchase
        await addDoc(collection(db, "purchases"), {
          categoryId: newPurchase.categoryId,
          itemId: newPurchase.itemId,
          purchaseQty: newPurchase.purchaseQty,
          purchaseDate: new Date(newPurchase.purchaseDate),
          createdAt: new Date(),
        });

        // Reset form
        setNewPurchase({
          categoryId: "",
          itemId: "",
          purchaseQty: 0,
          purchaseDate: new Date().toISOString().split("T")[0],
        });

        // Trigger success callback
        onSuccess();
        setIsModalOpen(false);
      };

      const handleAddCategory = async () => {
        if (!newCategoryName) {
          alert("Please enter a category name");
          return;
        }

        try {
          const categoryRef = await addDoc(collection(db, "categories"), {
            name: newCategoryName,
            createdAt: new Date(),
          });
          setNewPurchase({ ...newPurchase, categoryId: categoryRef.id });
          setNewCategoryName("");
          setIsCategoryModalOpen(false);
          fetchCategories();
        } catch (error) {
          console.error("Error adding category:", error);
        }
      };

      const handleAddItem = async () => {
        if (!newItemName) {
          alert("Please enter an item name");
          return;
        }

        if (!newPurchase.categoryId) {
          alert("Please select a category first");
          return;
        }

        try {
          const itemRef = await addDoc(collection(db, "items"), {
            categoryId: newPurchase.categoryId,
            name: newItemName,
            createdAt: new Date(),
          });
          setNewPurchase({ ...newPurchase, itemId: itemRef.id });
          setNewItemName("");
          setIsItemModalOpen(false);
          fetchItems(newPurchase.categoryId);
        } catch (error) {
          console.error("Error adding item:", error);
        }
      };

      return (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Purchase
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Purchase</h2>
                <form onSubmit={handleAddPurchase} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={newPurchase.categoryId}
                        onChange={(e) => {
                          setNewPurchase({ ...newPurchase, categoryId: e.target.value });
                          fetchItems(e.target.value);
                        }}
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
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      >
                        New Category
                      </button>
                    </div>
                  </div>

                  {/* Item Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={newPurchase.itemId}
                        onChange={(e) => setNewPurchase({ ...newPurchase, itemId: e.target.value })}
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
                      <button
                        type="button"
                        onClick={() => setIsItemModalOpen(true)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      >
                        New Item
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newPurchase.purchaseQty}
                      onChange={(e) =>
                        setNewPurchase({ ...newPurchase, purchaseQty: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Purchase Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={newPurchase.purchaseDate}
                      onChange={(e) =>
                        setNewPurchase({ ...newPurchase, purchaseDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Purchase
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Category Modal */}
          {isCategoryModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Item Modal */}
          {isItemModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Item</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsItemModalOpen(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
