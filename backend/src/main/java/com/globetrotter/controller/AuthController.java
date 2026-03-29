package com.globetrotter.controller;

import com.globetrotter.model.User;
import com.globetrotter.repository.UserRepository;
import com.globetrotter.security.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// ─── AuthController ───────────────────────────────────────────────────────────
// Handles user registration and login.
// Base URL: /api/auth
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authManager;

    // ─── POST /api/auth/register ──────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // Create new user with hashed password
        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password)); // Hash password!
        userRepository.save(user);

        // Generate JWT token for immediate login after registration
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "email", user.getEmail(), "name", user.getName()));
    }

    // ─── POST /api/auth/login ─────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Spring Security validates email + password
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email, request.password)
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        // Load user and generate token
        User user = userRepository.findByEmail(request.email).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "email", user.getEmail(), "name", user.getName()));
    }

    // ─── Inner DTO classes ────────────────────────────────────────────────────
    // Kept here so they're close to where they're used (easy to understand)
    @Data static class RegisterRequest {
        @NotBlank String name;
        @Email @NotBlank String email;
        @NotBlank String password;
    }

    @Data static class LoginRequest {
        @Email @NotBlank String email;
        @NotBlank String password;
    }
}
