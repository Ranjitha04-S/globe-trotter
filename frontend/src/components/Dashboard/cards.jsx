
import React, { useEffect, useState } from 'react';

// Utility to check if a trip is upcoming (endDate in future)
function isUpcoming(endDate) {
	if (!endDate) return false;
	// Accepts 'dd-mm-yyyy' or 'yyyy-mm-dd'
	let parts = endDate.includes('-') ? endDate.split('-') : [];
	let dateObj;
	if (parts.length === 3) {
		if (parts[0].length === 4) {
			// yyyy-mm-dd
			dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
		} else {
			// dd-mm-yyyy
			dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
		}
	} else {
		dateObj = new Date(endDate);
	}
	return dateObj > new Date();
}

export default function Cards() {
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchTrips() {
			setLoading(true);
			setError('');
			try {
				const res = await fetch('http://localhost:5000/api/trips');
				if (!res.ok) throw new Error('Failed to fetch trips');
				const data = await res.json();
				setTrips(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchTrips();
	}, []);

	// Unique visited countries (destination) where endDate is in the past
	const visitedCountries = new Set();
	// Unique upcoming countries (destination) where endDate is in the future
	const upcomingCountries = new Set();
	trips.forEach(trip => {
		if (isUpcoming(trip.endDate)) {
			upcomingCountries.add(trip.destination);
		} else {
			visitedCountries.add(trip.destination);
		}
	});

	return (
		<div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto mt-8">
			{/* Visited Countries Card */}
			<div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
				<h3 className="text-lg font-semibold text-gray-700 mb-2">Visited Countries</h3>
				<div className="text-4xl font-bold text-blue-600">{visitedCountries.size}</div>
				<p className="text-gray-500 mt-1">Countries you have visited</p>
			</div>
			{/* Upcoming Countries Card */}
			<div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
				<h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Countries</h3>
				<div className="text-4xl font-bold text-green-600">{upcomingCountries.size}</div>
				<p className="text-gray-500 mt-1">Countries in your upcoming trips</p>
			</div>
			{error && <div className="text-red-600 text-center w-full">{error}</div>}
		</div>
	);
}
