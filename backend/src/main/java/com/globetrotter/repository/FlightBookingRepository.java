package com.globetrotter.repository;

import com.globetrotter.model.FlightBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// ─── FlightBookingRepository ──────────────────────────────────────────────────
@Repository
public interface FlightBookingRepository extends JpaRepository<FlightBooking, Long> {

    // Get all bookings for a trip
    List<FlightBooking> findByTripId(Long tripId);

    // Get all booked seat numbers for a flight (to show which seats are taken)
    List<String> findSeatNumberByTripId(Long tripId);

    // Check if a specific seat is already booked on a flight
    boolean existsByTripIdAndSeatNumber(Long tripId, String seatNumber);
}
