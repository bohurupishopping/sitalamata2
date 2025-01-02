import React, { useState } from "react";
    import { signOut } from "firebase/auth";
    import { auth } from "../firebase";
    import { useNavigate } from "react-router-dom";

    export default function Sidebar({ open, setOpen }) {
      const navigate = useNavigate();

      const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate("/");
        } catch (error) {
          console.error(error);
        }
      };

      const navItems = [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          color: "from-violet-500 to-pink-500",
        },
        {
          name: "Purchase",
          path: "/purchase",
          icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
          color: "from-blue-500 to-cyan-500",
        },
        {
          name: "Sales",
          path: "/sales",
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          color: "from-green-500 to-teal-500",
        },
        {
          name: "Reports",
          path: "/reports",
          icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          color: "from-orange-500 to-amber-500",
        },
        {
          name: "Stock",
          path: "/stock-overview",
          icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
          color: "from-red-500 to-pink-500",
        },
      ];

      return (
        <div
          className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 ${
            open ? "w-64" : "w-20"
          }`}
        >
          {/* Header Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-2 rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className={`text-xl font-bold text-gray-800 ${!open && "hidden"}`}>
                Sitalamata
              </h1>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="p-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className={`flex items-center p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-violet-500/10 to-pink-500/10"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-sm`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </div>
                    <span
                      className={`ml-3 text-sm group-hover:text-gray-900 ${
                        !open && "hidden"
                      } ${
                        location.pathname === item.path
                          ? "font-medium text-gray-900"
                          : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Collapse Button */}
            <div className="mt-3">
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={open ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"}
                    />
                  </svg>
                </div>
                <span className={`ml-3 text-sm ${!open && "hidden"}`}>
                  {open ? "Collapse" : "Expand"}
                </span>
              </button>
            </div>
          </nav>

          {/* Profile Section */}
          <div className="absolute bottom-0 w-full p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white">A</span>
              </div>
              <div className={`ml-3 ${!open && "hidden"}`}>
                <p className="text-sm font-medium text-gray-800">Admin</p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
