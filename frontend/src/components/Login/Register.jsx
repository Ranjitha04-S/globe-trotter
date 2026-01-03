
import { useState } from "react";
import { authAPI } from "../../services/api";
import notify from "../../utils/notify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authAPI.register({ name, email, password });

      // Store token and user like login
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Notify app/navbar about auth change and navigate
      window.dispatchEvent(
        new CustomEvent("auth-changed", {
          detail: { isAuthenticated: true, user: res.data.user }
        })
      );
      window.dispatchEvent(new Event("login-success"));
      // show reusable success alert
      try { await notify.success('Registered', `Welcome, ${res.data.user?.name || res.data.user?.email || ''}`) } catch (e) { /* swallow */ }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        notify.error('Registration failed', err.response.data.message)
      } else {
        setError("Registration failed. Please try again.");
        notify.error('Registration failed', 'Please try again')
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] w-full">
      {/* Left promotional panel */}
      <div className="hidden lg:block" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=9f8f2b5d4f8a7a7b8a4d6b9a7d2b6c3d)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="h-full w-full bg-black/30 flex items-center justify-center">
          <div className="p-10 max-w-md text-white">
            <h2 className="text-4xl font-extrabold mb-4">Empowering your next adventure.</h2>
            <p className="text-white/90">Join thousands of travelers planning their perfect personalized itineraries today.</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Create your account</h1>
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              className="w-full p-3 border border-gray-200 rounded"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full p-3 border border-gray-200 rounded"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <input
              className="w-full p-3 border border-gray-200 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />

            {error && <div className="text-red-600">{error}</div>}

            <div className="space-y-3">
              <div className="flex justify-center">
                <button type="submit" className="w-30 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-full font-semibold shadow-md transition-colors">Sign up</button>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">Already have an account? <span role="link" tabIndex={0} className="text-blue-600 underline cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('show-login-modal'))} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { window.dispatchEvent(new CustomEvent('show-login-modal')) } }}>Sign in</span></p>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
}
