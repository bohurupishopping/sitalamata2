import React from "react";
    import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
    import LoginPage from "./pages/LoginPage";
    import Dashboard from "./pages/Dashboard";
    import Purchase from "./pages/Purchase";
    import Sales from "./pages/Sales";
    import StockOverview from "./pages/StockOverview";
    import Reports from "./pages/Reports";
    import { useAuth } from "./contexts/AuthContext";

    function App() {
      const { currentUser } = useAuth();

      return (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />}
            />
            <Route
              path="/dashboard"
              element={currentUser ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/purchase"
              element={currentUser ? <Purchase /> : <Navigate to="/" />}
            />
            <Route
              path="/sales"
              element={currentUser ? <Sales /> : <Navigate to="/" />}
            />
            <Route
              path="/stock-overview"
              element={currentUser ? <StockOverview /> : <Navigate to="/" />}
            />
            <Route
              path="/reports"
              element={currentUser ? <Reports /> : <Navigate to="/" />}
            />
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;
