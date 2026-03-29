import { useState } from 'react'
import './SeatMap.css'

// ─── SeatMap ──────────────────────────────────────────────────────────────────
// Renders the aircraft cabin with all seats.
// Users can click to select a seat. Booked seats are greyed out.
//
// Props:
//   seats        — array of seat objects from the API
//   onSeatSelect — callback when user clicks a seat
//   selectedSeat — currently selected seat number (string)
export default function SeatMap({ seats, onSeatSelect, selectedSeat }) {
  const [filterClass, setFilterClass] = useState('ALL')

  if (!seats || seats.length === 0) {
    return <p className="loading">Loading seat map...</p>
  }

  // Group seats by row number for easy rendering
  const rows = {}
  seats.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = []
    rows[seat.row].push(seat)
  })

  // Filter seats by class if needed
  const rowNumbers = Object.keys(rows).map(Number).sort((a, b) => a - b)

  const getSeatClass = (seat) => {
    if (seat.isBooked)                       return 'seat booked'
    if (seat.seatNumber === selectedSeat)    return `seat selected`
    return `seat available ${seat.seatClass}`
  }

  // Count available seats per class
  const counts = seats.reduce((acc, s) => {
    if (!s.isBooked) acc[s.seatClass] = (acc[s.seatClass] || 0) + 1
    return acc
  }, {})

  return (
    <div className="seatmap-wrapper">
      {/* Legend */}
      <div className="seatmap-legend">
        <div className="legend-item"><span className="legend-box FIRST"></span> First Class ({counts.FIRST || 0} free)</div>
        <div className="legend-item"><span className="legend-box BUSINESS"></span> Business ({counts.BUSINESS || 0} free)</div>
        <div className="legend-item"><span className="legend-box ECONOMY"></span> Economy ({counts.ECONOMY || 0} free)</div>
        <div className="legend-item"><span className="legend-box booked"></span> Booked</div>
        {selectedSeat && <div className="legend-item"><span className="legend-box selected"></span> Selected: {selectedSeat}</div>}
      </div>

      {/* Class filter buttons */}
      <div className="class-filter">
        {['ALL','FIRST','BUSINESS','ECONOMY'].map(c => (
          <button
            key={c}
            className={`filter-btn ${filterClass === c ? 'active' : ''}`}
            onClick={() => setFilterClass(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Aircraft cabin */}
      <div className="cabin">
        {/* Column headers */}
        <div className="column-headers">
          <span className="row-num"></span>
          {['A','B','C','','D','E','F'].map((col, i) => (
            <span key={i} className={`col-header ${col === '' ? 'aisle-gap' : ''}`}>{col}</span>
          ))}
        </div>

        {/* Seat rows */}
        {rowNumbers.map(rowNum => {
          const rowSeats = rows[rowNum].sort((a, b) => a.column.localeCompare(b.column))
          const sectionClass = rowSeats[0]?.seatClass || ''

          // Skip rows that don't match filter
          if (filterClass !== 'ALL' && sectionClass !== filterClass) return null

          return (
            <div key={rowNum} className={`seat-row ${sectionClass}`}>
              {/* Row number */}
              <span className="row-num">{rowNum}</span>

              {/* Left seats: A B C */}
              {rowSeats.filter(s => ['A','B','C'].includes(s.column)).map(seat => (
                <button
                  key={seat.seatNumber}
                  className={getSeatClass(seat)}
                  onClick={() => !seat.isBooked && onSeatSelect(seat)}
                  disabled={seat.isBooked}
                  title={`Seat ${seat.seatNumber} — ${seat.seatClass}${seat.isBooked ? ' (Booked)' : ''}`}
                >
                  {seat.seatNumber === selectedSeat ? '✓' : seat.column}
                </button>
              ))}

              {/* Aisle gap */}
              <span className="aisle-gap">✈</span>

              {/* Right seats: D E F */}
              {rowSeats.filter(s => ['D','E','F'].includes(s.column)).map(seat => (
                <button
                  key={seat.seatNumber}
                  className={getSeatClass(seat)}
                  onClick={() => !seat.isBooked && onSeatSelect(seat)}
                  disabled={seat.isBooked}
                  title={`Seat ${seat.seatNumber} — ${seat.seatClass}${seat.isBooked ? ' (Booked)' : ''}`}
                >
                  {seat.seatNumber === selectedSeat ? '✓' : seat.column}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {selectedSeat && (
        <p className="selected-info">
          ✅ You selected seat <strong>{selectedSeat}</strong>. Confirm your booking below.
        </p>
      )}
    </div>
  )
}
