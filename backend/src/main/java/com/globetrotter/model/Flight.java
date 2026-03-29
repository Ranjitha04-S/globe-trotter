package com.globetrotter.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// ─── Flight Entity ────────────────────────────────────────────────────────────
// Represents an available flight that users can search and book.
@Data
@NoArgsConstructor
@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;  // e.g. "AI-202"
    private String airline;       // e.g. "Air India"
    private String fromCity;
    private String toCity;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    // Total seats in this flight
    private int totalSeats = 60;

    // Prices per class
    private Double economyPrice;
    private Double businessPrice;
    private Double firstClassPrice;

    // Aircraft type (used to determine seat layout)
    private String aircraftType = "BOEING_737";  // BOEING_737, AIRBUS_A320, WIDE_BODY
}
