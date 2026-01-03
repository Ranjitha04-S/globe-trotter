
import React, { useState } from 'react';

const PLACES = [
	{
		name: 'Eiffel Tower',
		country: 'France',
		image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
	},
	{
		name: 'Great Wall of China',
		country: 'China',
		image: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800',
	},
	{
		name: 'Machu Picchu',
		country: 'Peru',
		image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
	},
	{
		name: 'Taj Mahal',
		country: 'India',
		image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
	},
	{
		name: 'Statue of Liberty',
		country: 'USA',
		image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800',
	},
	{
		name: 'Colosseum',
		country: 'Italy',
		image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800',
	},
	{
		name: 'Christ the Redeemer',
		country: 'Brazil',
		image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
	},
	{
		name: 'Santorini',
		country: 'Greece',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
	},
	{
		name: 'Sydney Opera House',
		country: 'Australia',
		image: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=800',
	},
	{
		name: 'Petra',
		country: 'Jordan',
		image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800',
	},
	{
		name: 'Pyramids of Giza',
		country: 'Egypt',
		image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
	},
	{
		name: 'Angkor Wat',
		country: 'Cambodia',
		image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?w=800',
	},
	{
		name: 'Grand Canyon',
		country: 'USA',
		image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
	},
	{
		name: 'Burj Khalifa',
		country: 'UAE',
		image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
	},
	{
		name: 'Niagara Falls',
		country: 'Canada/USA',
		image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800',
	},
	{
		name: 'Mount Fuji',
		country: 'Japan',
		image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
	},
	{
		name: 'Banff National Park',
		country: 'Canada',
		image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
	},
	{
		name: 'Table Mountain',
		country: 'South Africa',
		image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800',
	},
	{
		name: 'Stonehenge',
		country: 'UK',
		image: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800',
	},
	{
		name: 'Serengeti National Park',
		country: 'Tanzania',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
	},
];

function PlaceCard({ place }) {
	return (
		<div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
			<div className="relative h-36 overflow-hidden">
				<img
					src={place.image}
					alt={place.name}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="p-4 flex-1 flex flex-col justify-between">
				<h3 className="text-lg font-bold text-gray-800 mb-1">{place.name}</h3>
				<p className="text-gray-600 text-sm">{place.country}</p>
			</div>
		</div>
	);
}

export default function Recommendation() {
	const [slide, setSlide] = useState(0); // 0, 1, 2, 3
	const slides = [0, 1, 2, 3];
	// Each slide shows 5 places (2 rows x 5 columns = 10 per slide)
	// But user wants 2 rows, 5 columns, slide 5 by 5 (so 4 slides for 20 places)
	const placesToShow = PLACES.slice(slide * 5, slide * 5 + 10);

	return (
		<div className="w-full max-w-6xl mx-auto mt-12">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Top 20 Tourist Places</h2>
			<div className="flex justify-between items-center mb-4">
				   <button
					   className="px-4 py-2 rounded-lg text-white font-bold disabled:opacity-50"
					   style={{ backgroundColor: '#347BED' }}
					   onClick={() => setSlide(s => Math.max(0, s - 1))}
					   disabled={slide === 0}
				   >
					   &#8592; Prev
				   </button>
				   <button
					   className="px-4 py-2 rounded-lg text-white font-bold disabled:opacity-50"
					   style={{ backgroundColor: '#347BED' }}
					   onClick={() => setSlide(s => Math.min(3, s + 1))}
					   disabled={slide === 3}
				   >
					   Next &#8594;
				   </button>
			</div>
			<div className="grid grid-cols-5 gap-6">
				{placesToShow.slice(0, 5).map((place, idx) => (
					<PlaceCard key={idx} place={place} />
				))}
			</div>
			<div className="grid grid-cols-5 gap-6 mt-6">
				{placesToShow.slice(5, 10).map((place, idx) => (
					<PlaceCard key={idx} place={place} />
				))}
			</div>
		</div>
	);
}
