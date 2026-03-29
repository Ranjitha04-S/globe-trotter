package com.globetrotter.controller;

import com.globetrotter.model.Flight;
import com.globetrotter.model.FlightBooking;
import com.globetrotter.model.FlightBooking.BookingStatus;
import com.globetrotter.model.FlightBooking.SeatClass;
import com.globetrotter.model.Trip;
import com.globetrotter.model.User;
import com.globetrotter.repository.FlightBookingRepository;
import com.globetrotter.repository.FlightRepository;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// ─── FlightController ─────────────────────────────────────────────────────────
// Handles flight search, seat map, and seat booking.
// Base URL: /api/flights
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired private FlightRepository flightRepository;
    @Autowired private FlightBookingRepository bookingRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private UserRepository userRepository;

    private User getLoggedInUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    // ─── GET /api/flights/search ──────────────────────────────────────────────
    // Search available flights by origin and destination. Public endpoint.
    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String from,
            @RequestParam String to) {
        List<Flight> flights = flightRepository.findByFromCityIgnoreCaseAndToCityIgnoreCase(from, to);
        return ResponseEntity.ok(flights);
    }

    // ─── GET /api/flights/{flightId}/seats ────────────────────────────────────
    // Get the seat map for a flight — which seats are taken, which are free.
    // Returns a list of all seats with their status (AVAILABLE / BOOKED).
    @GetMapping("/{flightId}/seats")
    public ResponseEntity<Map<String, Object>> getSeatMap(@PathVariable Long flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        // Get all booked seat numbers for this flight
        List<FlightBooking> bookings = bookingRepository.findByTripId(flightId);
        List<String> bookedSeats = bookings.stream()
                .map(FlightBooking::getSeatNumber)
                .toList();

        // Build the seat layout (rows x columns)
        // Standard layout: rows 1-10 = First, 11-20 = Business, 21-60 = Economy
        // Columns: A B C | D E F (aisle in middle)
        List<Map<String, Object>> seatMap = buildSeatLayout(flight.getAircraftType(), bookedSeats);

        Map<String, Object> response = new HashMap<>();
        response.put("flight", flight);
        response.put("seats", seatMap);
        response.put("bookedSeats", bookedSeats);

        return ResponseEntity.ok(response);
    }

    // ─── POST /api/flights/book-seat ──────────────────────────────────────────
    // Book a specific seat on a flight, linked to a trip.
    @PostMapping("/book-seat")
    public ResponseEntity<?> bookSeat(
            @RequestBody SeatBookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Validate trip ownership
        User user = getLoggedInUser(userDetails);
        Trip trip = tripRepository.findById(request.tripId)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Flight flight = flightRepository.findById(request.flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        // Check seat is not already booked
        boolean alreadyBooked = bookingRepository.findByTripId(request.flightId).stream()
                .anyMatch(b -> b.getSeatNumber().equals(request.seatNumber)
                        && b.getBookingStatus() == BookingStatus.CONFIRMED);

        if (alreadyBooked) {
            return ResponseEntity.badRequest().body(Map.of("error", "Seat " + request.seatNumber + " is already booked"));
        }

        // Create the booking
        FlightBooking booking = new FlightBooking();
        booking.setFlightNumber(flight.getFlightNumber());
        booking.setAirline(flight.getAirline());
        booking.setFromCity(flight.getFromCity());
        booking.setToCity(flight.getToCity());
        booking.setDepartureTime(flight.getDepartureTime());
        booking.setArrivalTime(flight.getArrivalTime());
        booking.setSeatNumber(request.seatNumber);
        booking.setSeatClass(SeatClass.valueOf(request.seatClass));
        booking.setPassengerName(request.passengerName);
        booking.setPassengerEmail(request.passengerEmail);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setBookedAt(LocalDateTime.now());
        booking.setTrip(trip);

        // Set price based on class
        switch (booking.getSeatClass()) {
            case FIRST    -> booking.setPrice(flight.getFirstClassPrice());
            case BUSINESS -> booking.setPrice(flight.getBusinessPrice());
            default       -> booking.setPrice(flight.getEconomyPrice());
        }

        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    // ─── GET /api/flights/bookings/trip/{tripId} ──────────────────────────────
    // Get all flight bookings for a specific trip.
    @GetMapping("/bookings/trip/{tripId}")
    public ResponseEntity<List<FlightBooking>> getBookingsForTrip(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingRepository.findByTripId(tripId));
    }

    // ─── DELETE /api/flights/bookings/{bookingId} ─────────────────────────────
    // Cancel a seat booking.
    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return bookingRepository.findById(bookingId).map(booking -> {
            booking.setBookingStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ─── Helper: Build Seat Layout ────────────────────────────────────────────
    // Generates the full aircraft seat map based on aircraft type.
    // Returns a list of seat objects with number, class, row, column, status.
    private List<Map<String, Object>> buildSeatLayout(String aircraftType, List<String> bookedSeats) {
        String[] columns = {"A", "B", "C", "D", "E", "F"};
        int totalRows = aircraftType.equals("WIDE_BODY") ? 40 : 30;

        return java.util.stream.IntStream.rangeClosed(1, totalRows)
            .boxed()
            .flatMap(row -> java.util.Arrays.stream(columns).map(col -> {
                String seatNumber = row + col;
                String seatClass;

                // Determine seat class by row number
                if (row <= 3)       seatClass = "FIRST";
                else if (row <= 8)  seatClass = "BUSINESS";
                else                seatClass = "ECONOMY";

                Map<String, Object> seat = new HashMap<>();
                seat.put("seatNumber", seatNumber);
                seat.put("row", row);
                seat.put("column", col);
                seat.put("seatClass", seatClass);
                seat.put("isBooked", bookedSeats.contains(seatNumber));
                seat.put("isAisle", col.equals("C") || col.equals("D")); // Aisle seats

                return seat;
            }))
            .toList();
    }

    // ─── Inner DTO ────────────────────────────────────────────────────────────
    @Data
    static class SeatBookingRequest {
        Long flightId;
        Long tripId;
        String seatNumber;
        String seatClass;
        String passengerName;
        String passengerEmail;
    }
}
