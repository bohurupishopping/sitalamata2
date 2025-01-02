import React, { useState } from "react"; // Add useState import
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import { useData } from "../hooks/useData";
import { usePagination } from "../hooks/usePagination";

export default function StockOverview() {
  const { items, sales, purchases, loading } = useData();
  const { currentItems, currentPage, paginate, totalPages } = usePagination(items);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Add state for sidebar

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
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} /> {/* Pass setOpen prop */}
      <div className={`transition-all duration-200 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Stock Overview</h1>
          <button
            onClick={handleExportPDF}
            className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
                {currentItems.map((item) => {
                  const totalPurchaseQty = calculateTotalPurchaseQty(item.id);
                  const totalSales = sales
                    .filter((sale) => sale.itemId === item.id)
                    .reduce((sum, sale) => sum + sale.quantity, 0);
                  const closingStock = totalPurchaseQty - totalSales;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 border-b border-gray-200">{item.name}</td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {totalPurchaseQty} {item.unit || ""}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {totalSales} {item.unit || ""}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {closingStock} {item.unit || ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
