import React, { useState } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function AddPlan({ onBack }) {
	const [form, setForm] = useState({
		name: '',
		destination: '',
		startDate: '',
		endDate: '',
		budget: '',
		description: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');
		try {
			const res = await fetch('http://localhost:5000/api/trips', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name,
					destination: form.destination,
					startDate: form.startDate,
					endDate: form.endDate,
					budget: Number(form.budget),
					description: form.description,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to create trip');
			setSuccess('Trip created successfully!');
			setShowSuccessPopup(true);
			setForm({ name: '', destination: '', startDate: '', endDate: '', budget: '', description: '' });
		} catch (err) {
			setError(err.message);
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
							<svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
				{/* Description */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Description</label>
					<textarea name="description" placeholder="Tell us about your trip plans..." value={form.description} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 resize-none" />
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
