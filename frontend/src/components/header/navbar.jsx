
import React, { useState } from 'react';
import { Home, Map, Search, Calendar, User, Menu } from 'lucide-react';

const navLinks = [
	{ name: 'Dashboard', icon: <Home size={20} />, href: '#' },
	{ name: 'My Trips', icon: <Map size={20} />, href: '#' },
	{ name: 'Explore', icon: <Search size={20} />, href: '#' },
	{ name: 'Calendar', icon: <Calendar size={20} />, href: '#' },
	{ name: 'Profile', icon: <User size={20} />, href: '#' },
	{ name: 'Login', icon: null, href: '#', action: () => window.dispatchEvent(new CustomEvent('show-login-modal')) },
	{ name: 'Register', icon: null, href: '#', action: () => window.dispatchEvent(new CustomEvent('show-register-modal')) },
];

export default function Navbar({ onNavClick, activeNav }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className="bg-white shadow-sm w-full fixed top-0 left-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="flex items-center">
						<span className="bg-blue-500 rounded-full p-2 mr-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 17.813l-2.626-2.626a4.5 4.5 0 116.364-6.364l2.626 2.626m-6.364 6.364l6.364-6.364m-6.364 6.364l-1.06 1.06a1.5 1.5 0 002.12 2.12l1.06-1.06m-2.12-2.12l2.12 2.12" />
							</svg>
						</span>
						<span className="font-semibold text-xl tracking-tight text-gray-800">GlobeTrotter</span>
					</div>

					{/* Desktop Nav */}
					<div className="hidden md:flex space-x-2 items-center">
						{navLinks.map((link, idx) => (
							<a
								key={link.name}
								href={link.href}
								className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${activeNav === link.name ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
								onClick={e => {
									if (link.action) {
										e.preventDefault();
										link.action();
									} else {
										e.preventDefault();
										if (onNavClick) onNavClick(link.name);
									}
								}}
							>
								{link.icon && <span className="mr-2">{link.icon}</span>}
								<span>{link.name}</span>
							</a>
						))}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="text-gray-700 hover:text-blue-600 focus:outline-none"
							aria-label="Toggle menu"
						>
							<Menu size={28} />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Nav */}
			{menuOpen && (
				<div className="md:hidden bg-white shadow-lg px-4 pb-4">
					<div className="flex flex-col space-y-2 mt-2">
								{navLinks.map((link, idx) => (
									<a
										key={link.name}
										href={link.href}
										className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${activeNav === link.name ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
										onClick={e => {
											setMenuOpen(false);
											if (link.action) {
												e.preventDefault();
												link.action();
											} else {
												e.preventDefault();
												if (onNavClick) onNavClick(link.name);
											}
										}}
									>
										{link.icon && <span className="mr-2">{link.icon}</span>}
										<span>{link.name}</span>
									</a>
								))}
					</div>
				</div>
			)}
		</nav>
	);
}
