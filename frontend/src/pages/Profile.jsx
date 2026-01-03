import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import TripCard from '../components/TripCard/TripCard';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [trips, setTrips] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getProfile();
            setProfile(response.data.user);
            setTrips(response.data.trips);
            setStats(response.data.stats);
            setFormData({
                name: response.data.user.name,
                email: response.data.user.email
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await userAPI.updateProfile(formData);
            setProfile(response.data.user);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    return (
        /* 🔧 ONLY FIX: pt-24 added to avoid navbar overlap */
        <div className="min-h-screen bg-gray-50 pt-24 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        {/* User Info */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                {!isEditing ? (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {profile?.name}
                                        </h1>
                                        <p className="text-gray-600 mt-1">
                                            {profile?.email}
                                        </p>
                                    </>
                                ) : (
                                    <form onSubmit={handleUpdateProfile} className="space-y-3">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Name"
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Email"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: profile.name,
                                                        email: profile.email
                                                    });
                                                }}
                                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-indigo-600">
                                    {stats.totalTrips}
                                </p>
                                <p className="text-gray-600 mt-1">Total Trips</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.upcomingTrips}
                                </p>
                                <p className="text-gray-600 mt-1">Upcoming</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">
                                    {stats.completedTrips}
                                </p>
                                <p className="text-gray-600 mt-1">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-600">
                                    {stats.draftTrips}
                                </p>
                                <p className="text-gray-600 mt-1">Drafts</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Trips */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        My Trips
                    </h2>
                </div>

                {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trips.map(trip => (
                            <TripCard
                                key={trip._id}
                                trip={trip}
                                onEdit={() => console.log('Edit:', trip)}
                                onDelete={() => console.log('Delete:', trip)}
                                onView={() => console.log('View:', trip)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No trips yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start planning your first adventure!
                        </p>
                        <button
                            onClick={() =>
                                window.dispatchEvent(new Event('show-addplan-modal'))
                            }
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Create New Trip
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
