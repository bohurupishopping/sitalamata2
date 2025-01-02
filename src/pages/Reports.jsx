import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

export default function Reports() {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    fetchSales();
  }, [startDate, endDate]);

  const fetchSales = async () => {
    let q = query(collection(db, "sales"));
    if (startDate && endDate) {
      q = query(
        collection(db, "sales"),
        where("date", ">=", new Date(startDate)),
        where("date", "<=", new Date(endDate))
      );
    }
    const querySnapshot = await getDocs(q);
    const salesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSales(salesData);
    setTotalSales(salesData.reduce((sum, sale) => sum + sale.quantity, 0));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchSales();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Sales Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate || "All Time"} - ${endDate || "Present"}`, 14, 30);
    doc.text(`Total Sales: ${totalSales} units`, 14, 40);

    const tableData = sales.map((sale) => [
      new Date(sale.date?.toDate ? sale.date.toDate() : sale.date).toLocaleDateString(),
      sale.quantity,
    ]);

    doc.autoTable({
      startY: 50,
      head: [["Date", "Quantity"]],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 60 },
        1: { cellWidth: 40 },
      },
    });

    doc.save("sales-report.pdf");
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Sales Reports
          </h1>
          <button
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Reports
          </h2>
          <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="End Date"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Apply Filter
            </button>
          </form>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-lg shadow-lg text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Sales in Selected Period</p>
              <p className="text-2xl md:text-3xl font-bold">{totalSales} units</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Sales Data
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                        {new Date(sale.date?.toDate ? sale.date.toDate() : sale.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{sale.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
