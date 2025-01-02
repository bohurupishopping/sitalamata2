import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import { useData } from "../hooks/useData";
import { usePagination } from "../hooks/usePagination";

export default function StockOverview() {
  const { items, sales, purchases, loading } = useData();
  const { currentItems, currentPage, paginate, totalPages } = usePagination(items);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

    // Title
    doc.setFontSize(18);
    doc.text("Stock Overview Report", 14, 20);

    // Table Data
    const tableData = items.map((item) => {
      const totalPurchaseQty = calculateTotalPurchaseQty(item.id);
      const totalSales = sales
        .filter((sale) => sale.itemId === item.id)
        .reduce((sum, sale) => sum + sale.quantity, 0);
      const closingStock = totalPurchaseQty - totalSales;

      return [
        item.name,
        `${totalPurchaseQty} ${item.unit || ""}`,
        `${totalSales} ${item.unit || ""}`,
        `${closingStock} ${item.unit || ""}`,
      ];
    });

    // Table Headers
    const headers = [
      ["Item", "Purchase Quantity", "Total Sales", "Closing Stock"],
    ];

    // AutoTable
    doc.autoTable({
      startY: 30,
      head: headers,
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
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
      },
    });

    // Footer
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, doc.lastAutoTable.finalY + 10);

    // Save PDF
    doc.save("stock-overview-report.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {/* Add padding-bottom to account for mobile bottom navigation */}
      <div className={`transition-all duration-200 ${sidebarOpen ? "md:ml-64" : "md:ml-20"} p-4 md:p-6 pb-20 md:pb-6`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Stock Overview
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

        {/* Stock Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Stock Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Purchase Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Total Sales</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Closing Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((item) => {
                    const totalPurchaseQty = calculateTotalPurchaseQty(item.id);
                    const totalSales = sales
                      .filter((sale) => sale.itemId === item.id)
                      .reduce((sum, sale) => sum + sale.quantity, 0);
                    const closingStock = totalPurchaseQty - totalSales;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {totalPurchaseQty} {item.unit || ""}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {totalSales} {item.unit || ""}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            closingStock > 10 ? "bg-green-100 text-green-700" :
                            closingStock > 0 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {closingStock} {item.unit || ""}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 border border-gray-200 text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } ${i === 0 ? "rounded-l-md" : ""} ${
                  i === totalPages - 1 ? "rounded-r-md" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
