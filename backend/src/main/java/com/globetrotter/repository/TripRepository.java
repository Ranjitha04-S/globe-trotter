package com.globetrotter.repository;

import com.globetrotter.model.Trip;
import com.globetrotter.model.Trip.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// ─── TripRepository ───────────────────────────────────────────────────────────
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    // Get all trips for a specific user
    List<Trip> findByUserId(Long userId);

    // Get trips by user and status (e.g., all PLANNING trips)
    List<Trip> findByUserIdAndStatus(Long userId, TripStatus status);

    // Search trips by title or destination (case-insensitive)
    // @Query lets us write custom JPQL (similar to SQL but for Java objects)
    @Query("SELECT t FROM Trip t WHERE t.user.id = :userId AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.destination) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Trip> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    // Count total trips for a user (used in profile stats)
    long countByUserId(Long userId);

    // Count completed trips for a user
    long countByUserIdAndStatus(Long userId, TripStatus status);
}
