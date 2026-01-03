import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Cards from './cards';
import Mytrip from './Mytrip';

// Utility to check if a trip is upcoming (endDate in future)
function isUpcoming(endDate) {
  if (!endDate) return false;
  let parts = endDate.includes('-') ? endDate.split('-') : [];
  let dateObj;
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    }
  } else {
    dateObj = new Date(endDate);
  }
  return dateObj > new Date();
}

function isPast(endDate) {
  if (!endDate) return false;
  let parts = endDate.includes('-') ? endDate.split('-') : [];
  let dateObj;
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    }
  } else {
    dateObj = new Date(endDate);
  }
  return dateObj < new Date();
}

export default function HeroSection({ onPlanNewTrip }) {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user (simulate current user, or replace with real auth logic)
    async function fetchUser() {
      // For demo, fetch the first user
      const res = await fetch('http://localhost:5000/api/auth/users');
      if (res.ok) {
        const users = await res.json();
        setUser(users[0]);
      }
    }
    // Fetch trips
    async function fetchTrips() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/trips');
        if (!res.ok) throw new Error('Failed to fetch trips');
        const data = await res.json();
        setTrips(data);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    fetchTrips();
  }, []);

  const upcomingCount = trips.filter(trip => isUpcoming(trip.endDate)).length;
  const pastCount = trips.filter(trip => isPast(trip.endDate)).length;

  return (
    <>
      <section className="w-full flex justify-center items-center mt-24 md:mt-28 px-2">
        <div className="w-full max-w-5xl rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-400 to-pink-400 p-10 md:p-16 shadow-xl flex flex-col gap-6" style={{ minHeight: 220, position: 'relative' }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: '-1px' }}>
            {user ? `Welcome back, ${user.name.charAt(0).toUpperCase() + user.name.slice(1)}` : 'Welcome back'}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            Ready for your next adventure? You have <span className="font-bold">{upcomingCount}</span> upcoming trip{upcomingCount !== 1 ? 's' : ''} and <span className="font-bold">{pastCount}</span> place{pastCount !== 1 ? 's' : ''} on your bucket list.
          </p>
          <button
            className="flex items-center gap-2 font-medium px-6 py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2"
            style={{ backgroundColor: '#FFC857', color: '#0F172A' }}
            onClick={onPlanNewTrip}
          >
            <Plus size={22} />
            Plan New Trip
          </button>
          {/* Optional: add a subtle dot grid background with CSS or SVG if desired */}
        </div>
      </section>
      <Cards />
      <Mytrip />
    </>
  );
}
