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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    }));
  };

  const handleAddSale = async (saleData) => {
    await addDoc(collection(db, "sales"), saleData);
    fetchSales();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {/* Add padding-bottom to account for mobile bottom navigation */}
      <div className={`transition-all duration-200 ${sidebarOpen ? "md:ml-64" : "md:ml-20"} p-4 md:p-6 pb-20 md:pb-6`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Sales Tracking
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Sale
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Sales</p>
                <p className="text-2xl md:text-3xl font-bold">{sales.length}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
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
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">This Month</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {sales.filter(sale => new Date(sale.date).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Sales History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-green-500 to-green-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                        {items.find((item) => item.id === sale.itemId)?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{sale.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {sale.date?.toLocaleDateString() || "Invalid Date"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedSale(sale)}
                          className="text-green-500 hover:text-green-700 font-medium"
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

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm">
            {Array.from({ length: Math.ceil(sales.length / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 border border-gray-200 text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } ${i === 0 ? "rounded-l-md" : ""} ${
                  i === Math.ceil(sales.length / itemsPerPage) - 1 ? "rounded-r-md" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
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
