package com.globetrotter.controller;

import com.globetrotter.model.Trip;
import com.globetrotter.model.Trip.TripStatus;
import com.globetrotter.model.User;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// ─── TripController ───────────────────────────────────────────────────────────
// Full CRUD for trip management.
// Base URL: /api/trips
// All endpoints require authentication (JWT token in header).
@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired private TripRepository tripRepository;
    @Autowired private UserRepository userRepository;

    // Helper method: get logged-in user from JWT
    private User getLoggedInUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    // ─── GET /api/trips ───────────────────────────────────────────────────────
    // Get all trips for the logged-in user.
    // Optional: ?search=keyword&status=PLANNING
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        User user = getLoggedInUser(userDetails);
        List<Trip> trips;

        if (search != null && !search.isEmpty()) {
            trips = tripRepository.searchByKeyword(user.getId(), search);
        } else if (status != null && !status.isEmpty()) {
            trips = tripRepository.findByUserIdAndStatus(user.getId(), TripStatus.valueOf(status));
        } else {
            trips = tripRepository.findByUserId(user.getId());
        }

        return ResponseEntity.ok(trips);
    }

    // ─── GET /api/trips/{id} ──────────────────────────────────────────────────
    // Get one specific trip by its ID.
    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getLoggedInUser(userDetails);
        return tripRepository.findById(id)
            .filter(trip -> trip.getUser().getId().equals(user.getId())) // Only owner can view
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ─── POST /api/trips ──────────────────────────────────────────────────────
    // Create a new trip.
    @PostMapping
    public ResponseEntity<Trip> createTrip(
            @RequestBody TripRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getLoggedInUser(userDetails);

        Trip trip = new Trip();
        trip.setTitle(request.title);
        trip.setDestination(request.destination);
        trip.setDescription(request.description);
        trip.setBudget(request.budget);
        trip.setTotalTravelers(request.totalTravelers);
        trip.setStops(request.stops);
        trip.setUser(user);

        // Parse dates from string
        if (request.startDate != null) trip.setStartDate(LocalDate.parse(request.startDate));
        if (request.endDate != null)   trip.setEndDate(LocalDate.parse(request.endDate));
        if (request.status != null)    trip.setStatus(TripStatus.valueOf(request.status));

        return ResponseEntity.ok(tripRepository.save(trip));
    }

    // ─── PUT /api/trips/{id} ──────────────────────────────────────────────────
    // Update an existing trip.
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(
            @PathVariable Long id,
            @RequestBody TripRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getLoggedInUser(userDetails);

        return tripRepository.findById(id)
            .filter(trip -> trip.getUser().getId().equals(user.getId()))
            .map(trip -> {
                if (request.title != null)          trip.setTitle(request.title);
                if (request.destination != null)    trip.setDestination(request.destination);
                if (request.description != null)    trip.setDescription(request.description);
                if (request.budget != null)         trip.setBudget(request.budget);
                if (request.totalTravelers != null) trip.setTotalTravelers(request.totalTravelers);
                if (request.stops != null)          trip.setStops(request.stops);
                if (request.startDate != null)      trip.setStartDate(LocalDate.parse(request.startDate));
                if (request.endDate != null)        trip.setEndDate(LocalDate.parse(request.endDate));
                if (request.status != null)         trip.setStatus(TripStatus.valueOf(request.status));
                return ResponseEntity.ok(tripRepository.save(trip));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ─── DELETE /api/trips/{id} ───────────────────────────────────────────────
    // Delete a trip permanently.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getLoggedInUser(userDetails);

        return tripRepository.findById(id)
            .filter(trip -> trip.getUser().getId().equals(user.getId()))
            .map(trip -> {
                tripRepository.delete(trip);
                return ResponseEntity.ok(Map.of("message", "Trip deleted successfully"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ─── Inner DTO ────────────────────────────────────────────────────────────
    @Data
    static class TripRequest {
        String title, destination, description, startDate, endDate, status, stops;
        Double budget;
        Integer totalTravelers;
    }
}
