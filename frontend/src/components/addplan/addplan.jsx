import React, { useState } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { tripAPI } from '../../services/api';

export default function AddPlan({ onBack }) {
	const [form, setForm] = useState({
		name: '',
		destination: '',
		startDate: '',
		endDate: '',
		budget: '',
		description: '',
		status: 'planning',
		stops: 1,
		travelers: 1,
	});
	const [images, setImages] = useState([]); // Array of File
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		setImages(Array.from(e.target.files));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');
		try {
			// Always use FormData for consistency
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('destination', form.destination);
			formData.append('startDate', form.startDate);
			formData.append('endDate', form.endDate);
			formData.append('budget', form.budget);
			formData.append('description', form.description);
			formData.append('status', form.status);
			formData.append('stops', form.stops);
			formData.append('travelers', form.travelers);

			// Add images if present
			images.forEach((img) => {
				formData.append('images', img);
			});

			await tripAPI.create(formData);
			setShowSuccessPopup(true);
			// Reset form
			setForm({
				name: '',
				destination: '',
				startDate: '',
				endDate: '',
				budget: '',
				description: '',
				status: 'planning',
				stops: 1,
				travelers: 1,
			});
			setImages([]);
		} catch (err) {
			setError(err.response?.data?.error || err.message || 'Failed to create trip');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 relative mx-auto my-8 md:my-16" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
			{/* Success Popup Modal */}
			{showSuccessPopup && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative">
						<button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowSuccessPopup(false)}>
							<X size={24} />
						</button>
						<div className="flex flex-col items-center gap-3">
							<svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e" /><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
							<h3 className="text-xl font-semibold text-green-700">Trip Created!</h3>
							<p className="text-gray-700 text-center">Your trip has been added successfully.</p>
							<button
								className="mt-4 px-6 py-2 rounded-lg font-medium shadow bg-green-600 text-white hover:bg-green-700"
								onClick={() => setShowSuccessPopup(false)}
							>
								OK
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Back */}
			<button
				className="flex items-center gap-1 mb-6 px-4 py-2 rounded-md font-medium shadow"
				type="button"
				onClick={onBack}
				style={{ backgroundColor: '#347BED', color: '#fff' }}
			>
				<ArrowLeft size={20} />
				<span className="text-base font-medium">Back</span>
			</button>
			<h2 className="text-2xl font-semibold mb-8 text-gray-800">Create New Trip</h2>
			<form className="space-y-6" onSubmit={handleSubmit}>
				{/* Trip Name */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Trip Name</label>
					<input name="name" type="text" placeholder="My Amazing Trip" value={form.name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" required />
				</div>
				{/* Destination */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Destination</label>
					<input name="destination" type="text" placeholder="Paris, France" value={form.destination} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" required />
				</div>
				{/* Dates */}
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-gray-700 font-medium mb-1">Start Date</label>
						<input name="startDate" type="text" placeholder="dd-mm-yyyy" value={form.startDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" required />
					</div>
					<div className="flex-1">
						<label className="block text-gray-700 font-medium mb-1">End Date</label>
						<input name="endDate" type="text" placeholder="dd-mm-yyyy" value={form.endDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" required />
					</div>
				</div>
				{/* Budget */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Budget (USD)</label>
					<input name="budget" type="number" placeholder="2500" value={form.budget} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" required />
				</div>

				{/* Additional Fields */}
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<label className="block text-gray-700 font-medium mb-1">Number of Stops</label>
						<input name="stops" type="number" min="1" placeholder="1" value={form.stops} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" />
					</div>
					<div className="flex-1">
						<label className="block text-gray-700 font-medium mb-1">Number of Travelers</label>
						<input name="travelers" type="number" min="1" placeholder="1" value={form.travelers} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400" />
					</div>
				</div>

				{/* Status */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Trip Status</label>
					<select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700">
						<option value="planning">Planning</option>
						<option value="confirmed">Confirmed</option>
						<option value="draft">Draft</option>
						<option value="completed">Completed</option>
					</select>
				</div>
				{/* Description */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Description</label>
					<textarea name="description" placeholder="Tell us about your trip plans..." value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 resize-none" />
				</div>
				{/* Images (optional) */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Images <span className="text-gray-400 font-normal">(optional)</span></label>
					<input
						type="file"
						name="images"
						accept="image/*"
						multiple
						onChange={handleImageChange}
						className="block w-full text-gray-700 border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					{images.length > 0 && (
						<div className="mt-2 text-sm text-gray-600">
							Selected: {images.map(img => img.name).join(', ')}
						</div>
					)}
				</div>
				{/* Buttons */}
				<div className="flex flex-col md:flex-row gap-4 mt-6">
					<button
						type="submit"
						className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2"
						style={{ backgroundColor: '#347BED', color: '#fff' }}
						disabled={loading}
					>
						<Save size={20} /> {loading ? 'Saving...' : 'Save Trip'}
					</button>
					<button
						type="button"
						className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2"
						style={{ backgroundColor: '#64748B', color: '#fff' }}
						onClick={onBack}
					>
						<X size={20} /> Cancel
					</button>
				</div>
				{error && <div className="text-red-600 text-center mt-2">{error}</div>}
				{/* Remove old success message, now handled by popup */}
			</form>
		</div>
	);
}
