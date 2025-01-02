import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Fetch all items
export const fetchItems = async () => {
  const querySnapshot = await getDocs(collection(db, "items"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch all sales
export const fetchSales = async () => {
  const querySnapshot = await getDocs(collection(db, "sales"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch all purchases
export const fetchPurchases = async () => {
  const querySnapshot = await getDocs(collection(db, "purchases"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch all categories
export const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new sale
export const addSale = async (saleData) => {
  await addDoc(collection(db, "sales"), saleData);
};

// Update a sale
export const updateSale = async (saleId, updatedData) => {
  await updateDoc(doc(db, "sales", saleId), updatedData);
};

// Delete a sale
export const deleteSale = async (saleId) => {
  await deleteDoc(doc(db, "sales", saleId));
};
