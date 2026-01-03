



import Navbar from './components/header/navbar';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import { useEffect, useState } from 'react';
import HeroSection from './components/Dashboard/herosection';
import AddPlan from './components/addplan/addplan';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';

function App() {
  const [modal, setModal] = useState(null); // null | 'login' | 'register' | 'addplan'
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const showLoginModal = () => setModal('login');
    const showRegisterModal = () => setModal('register');
    const showAddPlanModal = () => setModal('addplan');
    window.addEventListener('show-login-modal', showLoginModal);
    window.addEventListener('show-register-modal', showRegisterModal);
    window.addEventListener('show-addplan-modal', showAddPlanModal);

    const handleLoginSuccess = () => {
      setModal(null);
      setActiveNav('My Trips');
    };

    window.addEventListener('login-success', handleLoginSuccess);
    return () => {
      window.removeEventListener('show-login-modal', showLoginModal);
      window.removeEventListener('show-register-modal', showRegisterModal);
      window.removeEventListener('show-addplan-modal', showAddPlanModal);
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  }, []);

  // Get user name from localStorage
  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || '';
    } catch {
      return '';
    }
  };

  const [userName, setUserName] = useState(getUserName());

  useEffect(() => {
    const handleAuthChanged = () => {
      setUserName(getUserName());
    };
    window.addEventListener('auth-changed', handleAuthChanged);
    return () => window.removeEventListener('auth-changed', handleAuthChanged);
  }, []);

  // Fetch stats for dashboard cards
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setStats(null);
          return;
        }
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data.stats);
      } catch {
        setStats(null);
      }
    };
    fetchStats();
    window.addEventListener('auth-changed', fetchStats);
    return () => window.removeEventListener('auth-changed', fetchStats);
  }, []);

  // Render active page based on navigation
  const renderActivePage = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <HeroSection onPlanNewTrip={() => setModal('addplan')} userName={userName} stats={stats} />;
      case 'My Trips':
        return <MyTrips />;
      case 'Profile':
        return <Profile />;
      default:
        return <HeroSection onPlanNewTrip={() => setModal('addplan')} userName={userName} stats={stats} />;
    }
  };

  return (
    <>
      <Navbar onNavClick={setActiveNav} activeNav={activeNav} />

      {/* Active Page Content */}
      {renderActivePage()}

      {/* Modal for Login/Register/AddPlan */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`relative w-full ${modal === 'addplan' ? 'max-w-2xl' : 'max-w-md'} mx-auto`}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              {modal === 'login' && <Login />}
              {modal === 'register' && <Register />}
              {modal === 'addplan' && <AddPlan onBack={() => setModal(null)} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
