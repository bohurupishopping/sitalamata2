import React from "react";

    export default function Navbar({ setSidebarOpen }) {
      return (
        <div className="bg-white shadow">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">Admin</div>
            </div>
          </div>
        </div>
      );
    }
