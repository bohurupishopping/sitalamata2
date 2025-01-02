import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const itemsSnapshot = await getDocs(collection(db, "items"));
    setItems(itemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    const purchasesSnapshot = await getDocs(collection(db, "purchases"));
    setPurchases(purchasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    const salesSnapshot = await getDocs(collection(db, "sales"));
    setSales(salesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    setCategories(categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const calculateTotalStock = () => {
    const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.purchaseQty, 0);
    const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    return totalPurchases - totalSales;
  };

  const calculateTodaySales = () => {
    const today = new Date().toLocaleDateString();
    return sales.filter(sale => new Date(sale.date?.toDate ? sale.date.toDate() : sale.date).toLocaleDateString() === today)
      .reduce((sum, sale) => sum + sale.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {/* Add padding-bottom to account for mobile bottom navigation */}
      <div className={`transition-all duration-200 ${sidebarOpen ? "md:ml-64" : "md:ml-20"} p-4 md:p-6 pb-20 md:pb-6`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </h1>
          <button
            onClick={fetchData}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Items</p>
                <p className="text-2xl md:text-3xl font-bold">{items.length}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Stock</p>
                <p className="text-2xl md:text-3xl font-bold">{calculateTotalStock()}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Categories</p>
                <p className="text-2xl md:text-3xl font-bold">{categories.length}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 md:p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sales Today</p>
                <p className="text-2xl md:text-3xl font-bold">{calculateTodaySales()}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Purchases
            </h2>
            <div className="space-y-2">
              {purchases.slice(-5).map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{items.find(item => item.id === purchase.itemId)?.name || "Unknown Item"}</p>
                    <p className="text-sm text-gray-600">{new Date(purchase.purchaseDate.toDate()).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-blue-600">{purchase.purchaseQty} units</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Recent Sales
            </h2>
            <div className="space-y-2">
              {sales.slice(-5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{items.find(item => item.id === sale.itemId)?.name || "Unknown Item"}</p>
                    <p className="text-sm text-gray-600">{new Date(sale.date?.toDate ? sale.date.toDate() : sale.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-green-600">{sale.quantity} units</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
