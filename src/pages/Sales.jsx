import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import SalesForm from "../components/SalesForm";
import EditSaleModal from "../components/EditSaleModal";

export default function Sales() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchItems();
    fetchSales();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchSales = async () => {
    const querySnapshot = await getDocs(collection(db, "sales"));
    setSales(querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date) // Ensure date is a valid Date object
      };
    }));
  };

  const handleAddSale = async (saleData) => {
    await addDoc(collection(db, "sales"), saleData);
    fetchSales();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`transition-all duration-200 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Sales Tracking</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add New Sale
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Sales History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {items.find((item) => item.id === sale.itemId)?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {sale.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {sale.date?.toLocaleDateString() || "Invalid Date"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          <button
                            onClick={() => setSelectedSale(sale)}
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
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <SalesForm
          items={items}
          onSubmit={handleAddSale}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {selectedSale && (
        <EditSaleModal
          sale={selectedSale}
          items={items}
          onClose={() => setSelectedSale(null)}
          onSuccess={fetchSales}
        />
      )}
    </div>
  );
}
