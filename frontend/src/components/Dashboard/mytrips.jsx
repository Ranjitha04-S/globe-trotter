
import { useState, useEffect } from 'react';
import TripCard from '../TripCard/TripCard';
import { tripAPI } from '../../services/api';

export default function MyTripsCardsOnly() {
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTrips = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem('token');
				if (!token) {
					setTrips([]);
					setError('Please log in to view your trips.');
					return;
				}
				const response = await tripAPI.getAll();
				setTrips(response.data);
				setError(null);
			} catch (err) {
				setError('Failed to fetch trips');
			} finally {
				setLoading(false);
			}
		};
		fetchTrips();
	}, []);

	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
				<p className="mt-4 text-gray-600">Loading trips...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p className="text-red-800">{error}</p>
			</div>
		);
	}

	 return (
		 <div className="min-h-screen bg-gray-50 pt-8 pb-2 px-4 sm:px-6 lg:px-8 mb-0">
			 <div className="max-w-7xl mx-auto">
				 <h2 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h2>
				 {trips.length > 0 ? (
					 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						 {trips.map(trip => (
							 <TripCard
								 key={trip._id}
								 trip={trip}
							 />
						 ))}
					 </div>
				 ) : (
					 <div className="text-center py-16">
						 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							 <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							 </svg>
						 </div>
						 <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
						 <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
					 </div>
				 )}
			 </div>
		 </div>
	 );
}
