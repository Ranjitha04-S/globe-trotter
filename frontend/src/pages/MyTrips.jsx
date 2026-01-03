import { useState, useEffect } from 'react';
import TripCard from '../components/TripCard/TripCard';
import { tripAPI } from '../services/api';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    useEffect(() => {
        filterTrips();
    }, [trips, activeTab, searchQuery, sortBy]);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setTrips([]);
                setError('Please log in to view your trips.');
                return;
            }

            const response = await tripAPI.getAll({ sortBy });
            setTrips(response.data);
            setError(null);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Please log in to view your trips.');
            } else {
                setError(err.response?.data?.error || 'Failed to fetch trips');
            }
            console.error('Error fetching trips:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterTrips = () => {
        let filtered = [...trips];
        // Filter by tab using status only (to match Profile page)
        if (activeTab === 'upcoming') {
            filtered = filtered.filter(
                (trip) => trip.status === 'planning' || trip.status === 'confirmed'
            );
        } else if (activeTab === 'past') {
            filtered = filtered.filter((trip) => trip.status === 'completed');
        } else if (activeTab === 'drafts') {
            filtered = filtered.filter((trip) => trip.status === 'draft');
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(trip =>
                trip.name.toLowerCase().includes(query) ||
                trip.destination.toLowerCase().includes(query) ||
                trip.description?.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortBy === 'date') {
            filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredTrips(filtered);
    };

    const handleDelete = async (trip) => {
        if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
            try {
                await tripAPI.delete(trip._id);
                setTrips(trips.filter(t => t._id !== trip._id));
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete trip');
            }
        }
    };

    const handleEdit = (trip) => {
        // Trigger edit modal - you can implement this based on your modal system
        window.dispatchEvent(new CustomEvent('show-edit-trip-modal', { detail: trip }));
    };

    const handleView = (trip) => {
        // Navigate to trip details - implement based on your routing
        console.log('View trip:', trip);
    };

    const handleCreateNew = () => {
        window.dispatchEvent(new Event('show-addplan-modal'));
    };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'past', label: 'Past' },
        { id: 'drafts', label: 'Drafts' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
                    <p className="text-gray-600">Manage and organize your upcoming adventures and past memories.</p>
                </div>

                {/* Tabs and Controls */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search and Sort */}
                        <div className="flex gap-3 flex-1 lg:max-w-md">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="date">Sort by: Date</option>
                                <option value="name">Sort by: Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading trips...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Trips Grid */}
                {!loading && !error && (
                    <>
                        {filteredTrips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredTrips.map(trip => (
                                    <TripCard
                                        key={trip._id}
                                        trip={trip}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onView={handleView}
                                    />
                                ))}

                                {/* Create New Trip Card */}
                                <div
                                    onClick={handleCreateNew}
                                    className="bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors cursor-pointer flex items-center justify-center min-h-[400px]"
                                >
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Trip</h3>
                                        <p className="text-sm text-gray-600">Plan your next adventure from scratch.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery
                                        ? 'Try adjusting your search or filters'
                                        : 'Start planning your next adventure!'}
                                </p>
                                <button
                                    onClick={handleCreateNew}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Create Your First Trip
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
