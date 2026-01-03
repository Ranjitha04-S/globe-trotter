
import React, { useEffect, useState } from 'react';

function parseDate(dateStr) {
	// Accepts 'dd-mm-yyyy' or 'yyyy-mm-dd'
	if (!dateStr) return null;
	const parts = dateStr.split('-');
	if (parts.length === 3) {
		if (parts[0].length === 4) {
			// yyyy-mm-dd
			return new Date(parts[0], parts[1] - 1, parts[2]);
		} else {
			// dd-mm-yyyy
			return new Date(parts[2], parts[1] - 1, parts[0]);
		}
	}
	return new Date(dateStr);
}

function isUpcoming(trip) {
	const now = new Date();
	const start = parseDate(trip.startDate);
	return start && start > now;
}

function isPast(trip) {
	const now = new Date();
	const end = parseDate(trip.endDate);
	return end && end < now;
}

export default function Mytrip() {
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past'

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

	let filteredTrips = [];
	if (tab === 'upcoming') {
		filteredTrips = trips.filter(isUpcoming);
	} else {
		filteredTrips = trips.filter(isPast);
	}

	return (
		<div className="w-full max-w-6xl mx-auto mt-10">
			<div className="flex items-center justify-between mb-0">
				<h2 className="text-2xl font-bold text-gray-800">My Trips</h2>
				<div className="flex gap-2 relative">
					<button
						className={`px-0 py-0 text-base font-semibold focus:outline-none transition-colors duration-200 ${tab === 'upcoming' ? 'text-gray-900 font-bold' : 'text-gray-400 font-normal'}`}
						style={{ background: 'none', boxShadow: 'none', marginRight: '12px', border: 'none', borderRadius: 0, position: 'relative' }}
						onClick={() => setTab('upcoming')}
					>
						Upcoming
						{tab === 'upcoming' && (
							<span style={{
								display: 'block',
								height: '4px',
								borderRadius: '2px',
								background: '#23272F',
								marginTop: '4px',
								width: '80%',
								marginLeft: '10%',
								border: 'none',
							}}></span>
						)}
					</button>
					<button
						className={`px-0 py-0 text-base font-semibold focus:outline-none transition-colors duration-200 ${tab === 'past' ? 'text-gray-900 font-bold' : 'text-gray-400 font-normal'}`}
						style={{ background: 'none', boxShadow: 'none', border: 'none', borderRadius: 0, position: 'relative' }}
						onClick={() => setTab('past')}
					>
						Past
						{tab === 'past' && (
							<span style={{
								display: 'block',
								height: '4px',
								borderRadius: '2px',
								background: '#23272F',
								marginTop: '4px',
								width: '80%',
								marginLeft: '10%',
								border: 'none',
							}}></span>
						)}
					</button>
				</div>
			</div>
			{loading ? (
				<div className="text-center text-gray-500 py-10">Loading...</div>
			) : error ? (
				<div className="text-center text-red-600 py-10">{error}</div>
			) : filteredTrips.length === 0 ? (
				<div className="text-center text-gray-400 py-10">No trips found.</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTrips.map(trip => {
						const start = parseDate(trip.startDate);
						const end = parseDate(trip.endDate);
						const now = new Date();
						// For badge: days until start (upcoming) or finished (past)
						let badge = '';
						if (tab === 'upcoming' && start) {
							const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
							badge = diff > 0 ? `IN ${diff} DAYS` : 'SOON';
						} else if (tab === 'past' && end) {
							badge = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
						}
						// Only show image if present in trip.images
						return (
							<div key={trip._id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
								{trip.images && trip.images.length > 0 && (
									<div className="relative h-44 w-full">
										<img
											src={`http://localhost:5000/${trip.images[0].replace(/^uploads[\\/]/, 'uploads/')}`}
											alt={trip.destination}
											className="object-cover w-full h-full"
											style={{ display: 'block' }}
										/>
										{badge && (
											<div className="absolute top-3 right-3 bg-white/90 text-xs font-bold px-3 py-1 rounded-lg shadow text-blue-700">
												{badge}
											</div>
										)}
									</div>
								)}
								<div className="p-4 flex-1 flex flex-col">
									<div className="font-semibold text-lg text-gray-800 mb-1">{trip.destination}</div>
									<div className="text-gray-500 text-sm mb-2">{trip.startDate} - {trip.endDate}</div>
									<div className="text-gray-600 text-sm mb-2">{trip.name}</div>
									<div className="text-gray-400 text-xs mb-2 truncate">{trip.description}</div>
									<div className="flex items-center gap-2 mt-auto">
										{tab === 'upcoming' ? (
											<span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg">Planning</span>
										) : (
											<span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-lg">Finished</span>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
