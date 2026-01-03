import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/header/navbar'
import HeroSection from './components/Dashboard/herosection'
import AddPlan from './components/addplan/addplan'
import './App.css'


const navNames = ['Dashboard', 'My Trips', 'Explore', 'Calendar', 'Profile'];

function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [showAddPlan, setShowAddPlan] = useState(false);

  const handlePlanNewTrip = () => setShowAddPlan(true);
  const handleCloseAddPlan = () => setShowAddPlan(false);

  return (
    <>
      <Navbar onNavClick={setActiveNav} activeNav={activeNav} />
      <main className="pt-20">
        {activeNav === 'Dashboard' && <HeroSection onPlanNewTrip={handlePlanNewTrip} />}
        {activeNav !== 'Dashboard' && (
          <div className="w-full flex justify-center items-center min-h-[300px]">
            <h2 className="text-2xl text-gray-700 font-semibold">{activeNav} page coming soon...</h2>
          </div>
        )}
        {/* Modal for AddPlan */}
        {showAddPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-2xl mx-auto">
              <AddPlan onBack={handleCloseAddPlan} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App
