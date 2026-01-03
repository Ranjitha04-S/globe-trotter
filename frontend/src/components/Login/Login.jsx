import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%)' }}>
      <form className="bg-white p-6 rounded shadow w-80 border border-gray-200" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded placeholder-gray-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 border border-gray-300 rounded placeholder-gray-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => window.dispatchEvent(new CustomEvent('show-register'))}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
