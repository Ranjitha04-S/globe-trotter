package com.globetrotter.controller;

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

import java.util.Map;

// ─── UserController ───────────────────────────────────────────────────────────
// Handles user profile — get stats, update profile info.
// Base URL: /api/users
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private TripRepository tripRepository;

    private User getLoggedInUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    // ─── GET /api/users/profile ───────────────────────────────────────────────
    // Returns user info + their trip statistics.
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getLoggedInUser(userDetails);

        // Gather trip stats
        long totalTrips     = tripRepository.countByUserId(user.getId());
        long completedTrips = tripRepository.countByUserIdAndStatus(user.getId(), TripStatus.COMPLETED);
        long plannedTrips   = tripRepository.countByUserIdAndStatus(user.getId(), TripStatus.PLANNING);

        // Return profile + stats together (no separate endpoint needed)
        return ResponseEntity.ok(Map.of(
            "id",             user.getId(),
            "name",           user.getName(),
            "email",          user.getEmail(),
            "phone",          user.getPhone() != null ? user.getPhone() : "",
            "bio",            user.getBio() != null ? user.getBio() : "",
            "profileImage",   user.getProfileImage() != null ? user.getProfileImage() : "",
            "joinedAt",       user.getCreatedAt().toString(),
            "stats", Map.of(
                "totalTrips",     totalTrips,
                "completedTrips", completedTrips,
                "plannedTrips",   plannedTrips
            )
        ));
    }

    // ─── PUT /api/users/profile ───────────────────────────────────────────────
    // Update profile — name, phone, bio (not email or password here).
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getLoggedInUser(userDetails);

        // Only update fields that were sent
        if (request.name != null)         user.setName(request.name);
        if (request.phone != null)        user.setPhone(request.phone);
        if (request.bio != null)          user.setBio(request.bio);
        if (request.profileImage != null) user.setProfileImage(request.profileImage);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully",
            "name",    user.getName(),
            "phone",   user.getPhone() != null ? user.getPhone() : "",
            "bio",     user.getBio() != null ? user.getBio() : ""
        ));
    }

    // ─── Inner DTO ────────────────────────────────────────────────────────────
    @Data
    static class ProfileUpdateRequest {
        String name;
        String phone;
        String bio;
        String profileImage;
    }
}
