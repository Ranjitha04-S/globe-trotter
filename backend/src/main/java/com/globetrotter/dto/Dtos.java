package com.globetrotter.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// ─── Data Transfer Objects (DTOs) ────────────────────────────────────────────
// DTOs are plain objects used to send/receive data in API requests.
// They prevent exposing internal database entities directly.

// ─── Auth DTOs ────────────────────────────────────────────────────────────────
// Used for register and login requests
class RegisterRequest {
    @NotBlank public String name;
    @Email @NotBlank public String email;
    @NotBlank public String password;
}

class LoginRequest {
    @Email @NotBlank public String email;
    @NotBlank public String password;
}

class AuthResponse {
    public String token;
    public String email;
    public String name;

    public AuthResponse(String token, String email, String name) {
        this.token = token;
        this.email = email;
        this.name = name;
    }
}

// ─── Trip DTOs ────────────────────────────────────────────────────────────────
class TripRequest {
    public String title;
    public String destination;
    public String description;
    public String startDate;   // ISO format: "2025-06-15"
    public String endDate;
    public Double budget;
    public Integer totalTravelers;
    public String status;
    public String stops;
}

// ─── Flight Booking DTO ───────────────────────────────────────────────────────
class SeatBookingRequest {
    public Long flightId;
    public Long tripId;
    public String seatNumber;   // e.g. "12A"
    public String seatClass;    // "ECONOMY", "BUSINESS", "FIRST"
    public String passengerName;
    public String passengerEmail;
}
