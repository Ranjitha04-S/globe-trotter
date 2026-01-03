import React from 'react';
import { Plane, Plus } from 'lucide-react';

export default function HeroSection({ onPlanNewTrip }) {
	return (
		<section className="w-full flex justify-center items-center mt-8 md:mt-12 px-2">
			<div className="relative w-full max-w-6xl rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-400 to-pink-400 flex flex-col md:flex-row items-center md:items-stretch min-h-[300px] md:min-h-[320px] p-8 md:p-16 overflow-hidden">
				{/* Left content */}
				<div className="flex-1 flex flex-col justify-center z-10">
					<h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">Welcome to GlobeTrotter</h1>
					<p className="mt-4 text-lg md:text-xl text-blue-100 text-center md:text-left">Start planning your next adventure</p>
					<div className="mt-8 flex justify-center md:justify-start">
						<button
							className="flex items-center gap-2 font-medium px-6 py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2"
							style={{ backgroundColor: '#FFC857', color: '#0F172A' }}
							onClick={onPlanNewTrip}
						>
							<Plus size={22} />
							Plan New Trip
						</button>
					</div>
				</div>
				{/* Right icon */}
				<div className="absolute right-6 bottom-0 top-0 hidden md:flex items-center z-0">
					<Plane size={220} className="opacity-20 text-white" />
				</div>
				{/* Mobile icon (smaller, behind content) */}
				<div className="absolute right-2 bottom-2 md:hidden z-0">
					<Plane size={120} className="opacity-20 text-white" />
				</div>
			</div>
		</section>
	);
}
