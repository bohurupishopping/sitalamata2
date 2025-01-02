import React, { useState, useEffect } from "react";
    import { collection, getDocs, addDoc } from "firebase/firestore";
    import { db } from "../firebase";
    import { useAuth } from "../contexts/AuthContext";
    import Sidebar from "../components/Sidebar";

    export default function Sales() {
      const { currentUser } = useAuth();
      const [items, setItems] = useState([]);
      const [sales, setSales] = useState([]);
      const [newSale, setNewSale] = useState({
        itemId: "",
        quantity: 0,
        date: new Date().toISOString().split("T")[0],
      });
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
        setSales(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const handleAddSale = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "sales"), {
          ...newSale,
          date: new Date(newSale.date),
        });
        setNewSale({ itemId: "", quantity: 0, date: new Date().toISOString().split("T")[0] });
        fetchSales();
      };

      return (
        <div className="min-h-screen bg-gray-100">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div
            className={`transition-all duration-200 ${
              sidebarOpen ? "ml-64" : "ml-20"
            }`}
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Sales Tracking</h1>

              {/* Sales Form */}
              <form onSubmit={handleAddSale} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={newSale.itemId}
                    onChange={(e) => setNewSale({ ...newSale, itemId: e.target.value })}
                    className="p-2 border rounded"
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({ ...newSale, quantity: parseInt(e.target.value) })}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="date"
                    value={newSale.date}
                    onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  Add Sale
                </button>
              </form>

              {/* Sales Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Item
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Quantity
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {items.find((item) => item.id === sale.itemId)?.name}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">{sale.quantity}</td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
