import { useState, useEffect } from 'react'
import { flightsAPI, tripsAPI } from '../services/api'
import SeatMap from '../components/SeatMap/SeatMap'
import './FlightSearch.css'

// ─── FlightSearch Page ────────────────────────────────────────────────────────
// Step 1: Search flights by origin + destination.
// Step 2: Select a flight → see the seat map.
// Step 3: Pick a seat → fill passenger info → confirm booking.
export default function FlightSearch() {
  // Search state
  const [from, setFrom]       = useState('')
  const [to, setTo]           = useState('')
  const [flights, setFlights] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  // Seat map state
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [seatData, setSeatData]             = useState(null)
  const [selectedSeat, setSelectedSeat]     = useState(null)
  const [loadingSeats, setLoadingSeats]     = useState(false)

  // Booking form state
  const [trips, setTrips]                 = useState([])
  const [bookingForm, setBookingForm]     = useState({ tripId: '', passengerName: '', passengerEmail: '' })
  const [booking, setBooking]             = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [bookingError, setBookingError]   = useState('')

  // Load user trips for the booking dropdown
  useEffect(() => {
    tripsAPI.getAll().then(res => setTrips(res.data)).catch(() => {})
  }, [])

  // ── Step 1: Search Flights ──────────────────────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault()
    setSearchError('')
    setFlights([])
    setSelectedFlight(null)
    setSeatData(null)
    setSelectedSeat(null)
    setSearching(true)
    try {
      const res = await flightsAPI.search(from, to)
      if (res.data.length === 0) setSearchError('No flights found for this route.')
      setFlights(res.data)
    } catch {
      setSearchError('Search failed. Try again.')
    } finally {
      setSearching(false)
    }
  }

  // ── Step 2: Load Seat Map ───────────────────────────────────────────────────
  const handleSelectFlight = async (flight) => {
    setSelectedFlight(flight)
    setSeatData(null)
    setSelectedSeat(null)
    setBookingSuccess('')
    setBookingError('')
    setLoadingSeats(true)
    try {
      const res = await flightsAPI.getSeatMap(flight.id)
      setSeatData(res.data)
    } catch {
      setBookingError('Failed to load seat map.')
    } finally {
      setLoadingSeats(false)
    }
  }

  // ── Step 3: Book a Seat ─────────────────────────────────────────────────────
  const handleBookSeat = async (e) => {
    e.preventDefault()
    if (!selectedSeat) return
    if (!bookingForm.tripId) { setBookingError('Please select a trip first.'); return }

    setBooking(true)
    setBookingError('')
    try {
      await flightsAPI.bookSeat({
        flightId:      selectedFlight.id,
        tripId:        bookingForm.tripId,
        seatNumber:    selectedSeat.seatNumber,
        seatClass:     selectedSeat.seatClass,
        passengerName: bookingForm.passengerName,
        passengerEmail: bookingForm.passengerEmail,
      })
      setBookingSuccess(`✅ Seat ${selectedSeat.seatNumber} booked successfully!`)
      setSelectedSeat(null)
      // Refresh seat map to show the seat as taken
      const res = await flightsAPI.getSeatMap(selectedFlight.id)
      setSeatData(res.data)
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed.')
    } finally {
      setBooking(false)
    }
  }

  // Price label based on seat class
  const priceFor = (flight, seatClass) => {
    if (!flight) return 0
    if (seatClass === 'FIRST')    return flight.firstClassPrice
    if (seatClass === 'BUSINESS') return flight.businessPrice
    return flight.economyPrice
  }

  return (
    <div className="page">
      <h1>✈️ Flight Search & Seat Booking</h1>
      <p className="page-sub">Search for flights, pick your seat, and attach it to a trip.</p>

      {/* ── Step 1: Search Form ──────────────────────────────────────────── */}
      <div className="card search-form">
        <form onSubmit={handleSearch} className="search-row">
          <div className="form-group">
            <label>From</label>
            <input placeholder="e.g. Chennai" value={from} onChange={e => setFrom(e.target.value)} required />
          </div>
          <div className="swap-icon">⇄</div>
          <div className="form-group">
            <label>To</label>
            <input placeholder="e.g. Delhi" value={to} onChange={e => setTo(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary search-btn" disabled={searching}>
            {searching ? 'Searching...' : '🔍 Search'}
          </button>
        </form>
        {searchError && <p className="error-msg">{searchError}</p>}
      </div>

      {/* ── Step 2: Flight Results ────────────────────────────────────────── */}
      {flights.length > 0 && (
        <div className="flight-results">
          <h2>Available Flights</h2>
          <div className="flight-list">
            {flights.map(flight => (
              <div
                key={flight.id}
                className={`flight-card ${selectedFlight?.id === flight.id ? 'active' : ''}`}
                onClick={() => handleSelectFlight(flight)}
              >
                <div className="flight-airline">
                  <strong>{flight.airline}</strong>
                  <span className="flight-number">{flight.flightNumber}</span>
                </div>
                <div className="flight-route">
                  <span>{flight.fromCity}</span>
                  <span className="route-line">──✈──</span>
                  <span>{flight.toCity}</span>
                </div>
                <div className="flight-times">
                  {flight.departureTime && (
                    <span>{new Date(flight.departureTime).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}</span>
                  )}
                  {flight.arrivalTime && (
                    <span>→ {new Date(flight.arrivalTime).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}</span>
                  )}
                </div>
                <div className="flight-prices">
                  <span className="price-economy">Eco ₹{flight.economyPrice?.toLocaleString()}</span>
                  <span className="price-business">Biz ₹{flight.businessPrice?.toLocaleString()}</span>
                  <span className="price-first">1st ₹{flight.firstClassPrice?.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary select-btn">
                  {selectedFlight?.id === flight.id ? '✓ Selected' : 'Select →'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Seat Map ──────────────────────────────────────────────── */}
      {selectedFlight && (
        <div className="seat-section">
          <h2>
            🪑 Choose Your Seat — {selectedFlight.fromCity} ✈ {selectedFlight.toCity}
          </h2>

          {loadingSeats ? (
            <div className="loading">Loading seat map...</div>
          ) : seatData ? (
            <SeatMap
              seats={seatData.seats}
              selectedSeat={selectedSeat?.seatNumber}
              onSeatSelect={setSelectedSeat}
            />
          ) : null}

          {/* ── Step 4: Booking Form ─────────────────────────────────────── */}
          {selectedSeat && (
            <div className="card booking-form">
              <h3>📋 Confirm Booking — Seat {selectedSeat.seatNumber} ({selectedSeat.seatClass})</h3>
              <p className="booking-price">
                Price: <strong>₹{priceFor(selectedFlight, selectedSeat.seatClass)?.toLocaleString()}</strong>
              </p>

              <form onSubmit={handleBookSeat} className="booking-fields">
                <div className="form-group">
                  <label>Attach to Trip</label>
                  <select value={bookingForm.tripId} onChange={e => setBookingForm({...bookingForm, tripId: e.target.value})} required>
                    <option value="">Select a trip...</option>
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>{t.title} — {t.destination}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Passenger Name</label>
                  <input
                    placeholder="Full name on ticket"
                    value={bookingForm.passengerName}
                    onChange={e => setBookingForm({...bookingForm, passengerName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Passenger Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={bookingForm.passengerEmail}
                    onChange={e => setBookingForm({...bookingForm, passengerEmail: e.target.value})}
                    required
                  />
                </div>

                {bookingError   && <p className="error-msg">{bookingError}</p>}
                {bookingSuccess && <p className="success-msg">{bookingSuccess}</p>}

                <div className="booking-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setSelectedSeat(null)}>
                    Change Seat
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={booking}>
                    {booking ? 'Booking...' : '✅ Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {bookingSuccess && !selectedSeat && (
            <p className="success-msg" style={{marginTop:'16px'}}>{bookingSuccess}</p>
          )}
        </div>
      )}
    </div>
  )
}
