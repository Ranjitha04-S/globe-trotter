
import React from 'react';

export default function Cards({ stats }) {
       if (!stats) return null;
       return (
	       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
		       <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
			       <p className="text-4xl font-extrabold text-indigo-600 mb-2">{stats.totalTrips}</p>
			       <p className="text-gray-700 font-medium">Total Trips</p>
		       </div>
		       <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
			       <p className="text-4xl font-extrabold text-green-600 mb-2">{stats.upcomingTrips}</p>
			       <p className="text-gray-700 font-medium">Upcoming</p>
		       </div>
		       <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
			       <p className="text-4xl font-extrabold text-blue-600 mb-2">{stats.completedTrips}</p>
			       <p className="text-gray-700 font-medium">Completed</p>
		       </div>
		       <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center transition-transform hover:scale-105">
			       <p className="text-4xl font-extrabold text-gray-600 mb-2">{stats.draftTrips}</p>
			       <p className="text-gray-700 font-medium">Drafts</p>
		       </div>
	       </div>
       );
}
