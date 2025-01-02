import React, { useState, useEffect } from "react";
    import { collection, getDocs, query, where } from "firebase/firestore";
    import { db } from "../firebase";
    import { useAuth } from "../contexts/AuthContext";
    import { jsPDF } from "jspdf";
    import Sidebar from "../components/Sidebar";

    export default function Reports() {
      const { currentUser } = useAuth();
      const [sales, setSales] = useState([]);
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");
      const [sidebarOpen, setSidebarOpen] = useState(true);

      useEffect(() => {
        fetchSales();
      }, []);

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
        setSales(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const handleFilter = (e) => {
        e.preventDefault();
        fetchSales();
      };

      const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 10, 10);
        let y = 20;
        sales.forEach((sale) => {
          doc.text(
            `${new Date(sale.date).toLocaleDateString()}: ${sale.quantity} units`,
            10,
            y
          );
          y += 10;
        });
        doc.save("sales-report.pdf");
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
              <h1 className="text-2xl font-bold mb-6">Reports</h1>
              <form onSubmit={handleFilter} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Filter
                  </button>
                </div>
              </form>

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
                        Date
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 border-b border-gray-200">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">{sale.quantity}</td>
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
