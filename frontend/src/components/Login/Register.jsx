
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password
      });
      alert("Registered successfully");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input className="w-full p-2 mb-3 border border-gray-300 rounded placeholder-gray-400" placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} />

        <input className="w-full p-2 mb-3 border border-gray-300 rounded placeholder-gray-400" placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="w-full p-2 mb-3 border border-gray-300 rounded placeholder-gray-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Register
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => window.dispatchEvent(new CustomEvent('show-login'))}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
