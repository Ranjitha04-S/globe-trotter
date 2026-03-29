package com.globetrotter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// ─── Trip Entity ─────────────────────────────────────────────────────────────
// Represents a travel plan created by a user.
@Data
@NoArgsConstructor
@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String destination;

    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double budget;
    private Integer totalTravelers;

    // Status: PLANNING, CONFIRMED, ONGOING, COMPLETED, CANCELLED
    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.PLANNING;

    // Comma-separated list of stops (e.g. "Paris,Rome,Barcelona")
    private String stops;

    // Image URL or file path
    private String coverImage;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Many trips belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // One trip can have many flight bookings
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FlightBooking> flightBookings;

    // ─── Status Enum ─────────────────────────────────────────────────────────
    public enum TripStatus {
        PLANNING,    // Just started planning
        CONFIRMED,   // Dates & flights confirmed
        ONGOING,     // Currently on the trip
        COMPLETED,   // Trip finished
        CANCELLED    // Trip was cancelled
    }
}
