import React, { useState } from "react";
    import Sidebar from "../components/Sidebar";

    export default function Dashboard() {
      const [sidebarOpen, setSidebarOpen] = useState(true);

      return (
        <div className="min-h-screen bg-gray-100">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div
            className={`transition-all duration-200 ${
              sidebarOpen ? "ml-64" : "ml-20"
            }`}
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-500 text-sm font-medium">Total Items</h2>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-500 text-sm font-medium">Total Stock</h2>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-500 text-sm font-medium">Total Categories</h2>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-500 text-sm font-medium">Sales Today</h2>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
