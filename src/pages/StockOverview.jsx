import React, { useState, useEffect } from "react";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "../firebase";
    import { useAuth } from "../contexts/AuthContext";
    import { jsPDF } from "jspdf";
    import Sidebar from "../components/Sidebar";

    export default function StockOverview() {
      const { currentUser } = useAuth();
      const [items, setItems] = useState([]);
      const [sales, setSales] = useState([]);
      const [purchases, setPurchases] = useState([]);
      const [sidebarOpen, setSidebarOpen] = useState(true);

      useEffect(() => {
        fetchItems();
        fetchSales();
        fetchPurchases();
      }, []);

      const fetchItems = async () => {
        const querySnapshot = await getDocs(collection(db, "items"));
        setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const fetchSales = async () => {
        const querySnapshot = await getDocs(collection(db, "sales"));
        setSales(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const fetchPurchases = async () => {
        const querySnapshot = await getDocs(collection(db, "purchases"));
        setPurchases(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const calculateTotalPurchaseQty = (itemId) => {
        return purchases
          .filter((purchase) => purchase.itemId === itemId)
          .reduce((sum, purchase) => sum + purchase.purchaseQty, 0);
      };

      const calculateClosingStock = (itemId) => {
        const totalPurchaseQty = calculateTotalPurchaseQty(itemId);
        const totalSales = sales
          .filter((sale) => sale.itemId === itemId)
          .reduce((sum, sale) => sum + sale.quantity, 0);

        return totalPurchaseQty - totalSales;
      };

      const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Stock Overview Report", 10, 10);
        let y = 20;
        items.forEach((item) => {
          const closingStock = calculateClosingStock(item.id);
          doc.text(`${item.name}: ${closingStock} ${item.unit}`, 10, y);
          y += 10;
        });
        doc.save("stock-overview.pdf");
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
              <h1 className="text-2xl font-bold mb-6">Stock Overview</h1>
              <button
                onClick={handleExportPDF}
                className="mb-6 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Export PDF
              </button>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Item
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Purchase Quantity
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Total Sales
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Closing Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const totalPurchaseQty = calculateTotalPurchaseQty(item.id);
                      const totalSales = sales
                        .filter((sale) => sale.itemId === item.id)
                        .reduce((sum, sale) => sum + sale.quantity, 0);
                      const closingStock = totalPurchaseQty - totalSales;

                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 border-b border-gray-200">{item.name}</td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            {totalPurchaseQty} {item.unit}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            {totalSales} {item.unit}
                          </td>
                          <td className="px-6 py-4 border-b border-gray-200">
                            {closingStock} {item.unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
