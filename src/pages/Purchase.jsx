import React, { useState, useEffect } from "react";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "../firebase";
    import { useAuth } from "../contexts/AuthContext";
    import PurchaseForm from "../components/PurchaseForm";
    import PurchaseTable from "../components/PurchaseTable";
    import Sidebar from "../components/Sidebar";

    export default function Purchase() {
      const { currentUser } = useAuth();
      const [categories, setCategories] = useState([]);
      const [items, setItems] = useState([]);
      const [sidebarOpen, setSidebarOpen] = useState(true);

      useEffect(() => {
        fetchCategories();
        fetchItems();
      }, []);

      const fetchCategories = async () => {
        const querySnapshot = await getDocs(collection(db, "categories"));
        setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };

      const fetchItems = async () => {
        const querySnapshot = await getDocs(collection(db, "items"));
        setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
              <h1 className="text-2xl font-bold mb-6">Purchase Management</h1>

              {/* Purchase Form */}
              <PurchaseForm onSuccess={() => window.location.reload()} />

              {/* Purchase Table */}
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Purchase History</h2>
                <PurchaseTable />
              </div>
            </div>
          </div>
        </div>
      );
    }
