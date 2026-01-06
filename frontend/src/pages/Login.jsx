import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Employee Portal Login
        </h1>

        <input
          className="w-full mb-4 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          onClick={login}
        >
          Login
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Admin access only
        </p>
      </div>
    </div>
  );
}
