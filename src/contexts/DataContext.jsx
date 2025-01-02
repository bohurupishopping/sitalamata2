import React, { createContext, useState, useEffect } from "react";
import { fetchItems, fetchSales, fetchPurchases, fetchCategories } from "../services/firebaseService";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, salesData, purchasesData, categoriesData] = await Promise.all([
          fetchItems(),
          fetchSales(),
          fetchPurchases(),
          fetchCategories(),
        ]);
        setItems(itemsData);
        setSales(salesData);
        setPurchases(purchasesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    items,
    sales,
    purchases,
    categories,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
