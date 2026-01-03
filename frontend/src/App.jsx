import { useState } from 'react'
import './App.css'
// import TripBudget from './components/TripBudget'
// import MainLayout from './layouts/MainLayout'
import Budget from './pages/Budget'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Budget />
    </>
  )
}

export default App
