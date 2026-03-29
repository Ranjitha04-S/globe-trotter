package com.globetrotter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// ─── FlightBooking Entity ────────────────────────────────────────────────────
// Represents a flight booking linked to a trip, with seat selection.
@Data
@NoArgsConstructor
@Entity
@Table(name = "flight_bookings")
public class FlightBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String flightNumber;   // e.g. "AI-202"

    @NotBlank
    private String airline;        // e.g. "Air India"

    @NotBlank
    private String fromCity;       // Origin city

    @NotBlank
    private String toCity;         // Destination city

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    private Double price;

    // ─── Seat Details ────────────────────────────────────────────────────────
    private String seatNumber;     // e.g. "12A", "5C"

    // Class: ECONOMY, BUSINESS, FIRST
    @Enumerated(EnumType.STRING)
    private SeatClass seatClass = SeatClass.ECONOMY;

    // Seat status for this booking
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    private String passengerName;
    private String passengerEmail;

    @Column(updatable = false)
    private LocalDateTime bookedAt = LocalDateTime.now();

    // Many bookings belong to one trip
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    // ─── Enums ───────────────────────────────────────────────────────────────
    public enum SeatClass {
        ECONOMY, BUSINESS, FIRST
    }

    public enum BookingStatus {
        PENDING,    // Seat selected but not confirmed
        CONFIRMED,  // Payment done, seat confirmed
        CANCELLED   // Booking cancelled
    }
}
