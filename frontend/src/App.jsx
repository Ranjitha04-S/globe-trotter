import { useState } from 'react'
import './App.css'

import Login from './components/Login/Login'
import Register from './components/Login/Register'




import { useEffect } from 'react';

function App() {
  const [showLogin, setShowLogin] = useState(true);


  useEffect(() => {
    const showRegister = () => setShowLogin(false);
    const showLogin = () => setShowLogin(true);
    window.addEventListener('show-register', showRegister);
    window.addEventListener('show-login', showLogin);
    return () => {
      window.removeEventListener('show-register', showRegister);
      window.removeEventListener('show-login', showLogin);
    };
  }, []);

  return (
    <div>
      {showLogin ? <Login /> : <Register />}
      <div className="flex justify-center mt-4">
        {showLogin ? (
          <span>
            Don't have an account?{' '}
            <button className="text-blue-600 underline" onClick={() => setShowLogin(false)}>
              Register
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button className="text-blue-600 underline" onClick={() => setShowLogin(true)}>
              Login
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default App
