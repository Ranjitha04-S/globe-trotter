package com.globetrotter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

// ─── User Entity ─────────────────────────────────────────────────────────────
// Represents a registered user in the database.
// @Data from Lombok auto-generates getters, setters, toString, equals, hashCode
@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    @Column(unique = true) // No two users can share the same email
    private String email;

    @NotBlank
    private String password; // Stored as BCrypt hash (never plain text)

    private String phone;
    private String bio;
    private String profileImage;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // One user can have many trips
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Trip> trips;
}
