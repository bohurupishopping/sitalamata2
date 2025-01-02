import React, { useState, useEffect } from "react";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "../firebase";
    import EditPurchaseModal from "./EditPurchaseModal";

    export default function PurchaseTable() {
      const [purchases, setPurchases] = useState([]);
      const [categories, setCategories] = useState([]);
      const [items, setItems] = useState([]);
      const [selectedPurchase, setSelectedPurchase] = useState(null);

      useEffect(() => {
        fetchPurchases();
        fetchCategories();
        fetchItems();
      }, []);

      const fetchPurchases = async () => {
        const querySnapshot = await getDocs(collection(db, "purchases"));
        setPurchases(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const fetchCategories = async () => {
        const querySnapshot = await getDocs(collection(db, "categories"));
        setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const fetchItems = async () => {
        const querySnapshot = await getDocs(collection(db, "items"));
        setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Unknown Category";
      };

      const getItemName = (itemId) => {
        const item = items.find((item) => item.id === itemId);
        return item ? item.name : "Unknown Item";
      };

      return (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                    Item
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {getCategoryName(purchase.categoryId)}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {getItemName(purchase.itemId)}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {new Date(purchase.purchaseDate.toDate()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {purchase.purchaseQty}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedPurchase && (
            <EditPurchaseModal
              purchase={selectedPurchase}
              categories={categories}
              items={items}
              onClose={() => setSelectedPurchase(null)}
              onSuccess={fetchPurchases}
            />
          )}
        </div>
      );
    }
