import { useState } from 'react';
import PropTypes from 'prop-types';

const TripCard = ({ trip, onEdit, onDelete, onView }) => {
    const [imageError, setImageError] = useState(false);

    // Calculate status badge
    const getStatusBadge = () => {
        const now = new Date();
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        if (trip.status === 'draft') {
            return { label: 'Draft', color: 'bg-gray-500' };
        }
        if (trip.status === 'planning') {
            return { label: 'Planning', color: 'bg-purple-500' };
        }
        if (trip.status === 'confirmed') {
            if (startDate > now) {
                const daysLeft = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
                return { label: `${daysLeft} days left`, color: 'bg-orange-500' };
            }
            return { label: 'Confirmed', color: 'bg-green-500' };
        }
        if (trip.status === 'completed' || endDate < now) {
            return { label: 'Completed', color: 'bg-gray-600' };
        }
        return { label: 'Upcoming', color: 'bg-blue-500' };
    };

    const statusBadge = getStatusBadge();

    // Format date range
    const formatDateRange = () => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
    };

    // Get image URL
    const getImageUrl = () => {
        if (trip.images && trip.images.length > 0 && !imageError) {
            // Handle both local and remote images
            const imgPath = trip.images[0];
            if (imgPath.startsWith('http')) {
                return imgPath;
            }
            return `http://localhost:5000/${imgPath}`;
        }
        return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl()}
                    alt={trip.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                />
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 ${statusBadge.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {statusBadge.label}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{trip.name}</h3>

                {/* Date */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDateRange()}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {trip.stops || 1} stop{trip.stops !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {trip.travelers || 1} traveler{trip.travelers !== 1 ? 's' : ''}
                    </div>
                </div>

                                {/* Actions (only show if handlers are provided) */}
                                {(onView || onEdit || onDelete) && (
                                    <div className="flex gap-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(trip)}
                                                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                View Trip
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(trip)}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(trip)}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}
            </div>
        </div>
    );
};

TripCard.propTypes = {
    trip: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string.isRequired,
        destination: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        status: PropTypes.string,
        stops: PropTypes.number,
        travelers: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onView: PropTypes.func
};

export default TripCard;
