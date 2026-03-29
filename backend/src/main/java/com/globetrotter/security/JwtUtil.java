package com.globetrotter.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

// ─── JwtUtil ──────────────────────────────────────────────────────────────────
// Handles JWT token creation and validation.
// JWT = JSON Web Token — a secure way to store user identity without sessions.
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration; // in milliseconds (default: 24 hours)

    // Creates a signing key from our secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // ─── Generate Token ───────────────────────────────────────────────────────
    // Creates a JWT token with the user's email as the subject.
    // Token expires after 24 hours by default.
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)                                       // Who this token belongs to
                .setIssuedAt(new Date())                                 // When it was created
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Expiry
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)     // Sign with secret key
                .compact();
    }

    // ─── Extract Email ────────────────────────────────────────────────────────
    // Reads the user's email from the token payload.
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ─── Validate Token ───────────────────────────────────────────────────────
    // Returns true if token is valid and not expired.
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token is invalid, expired, or malformed
            return false;
        }
    }
}
