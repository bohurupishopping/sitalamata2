import React, { useState } from "react";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "../firebase";
    import { useNavigate } from "react-router-dom";
    import { useAuth } from "../contexts/AuthContext";

    export default function LoginPage() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const navigate = useNavigate();
      const { currentUser } = useAuth();

      if (currentUser) {
        navigate("/dashboard");
      }

      const handleLogin = async (e) => {
        e.preventDefault();
        try {
          await signInWithEmailAndPassword(auth, email, password);
          navigate("/dashboard");
        } catch (err) {
          setError(err.message);
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      );
    }
