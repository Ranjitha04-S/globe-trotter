import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // @ts-ignore
  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password
    });
    alert("Registered successfully");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input className="w-full p-2 mb-3 border" placeholder="Name"
          onChange={(e) => setName(e.target.value)} />

        <input className="w-full p-2 mb-3 border" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="w-full p-2 mb-3 border"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
