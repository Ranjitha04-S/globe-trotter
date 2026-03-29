package com.globetrotter.repository;

import com.globetrotter.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// ─── FlightRepository ─────────────────────────────────────────────────────────
@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Search flights by origin and destination
    List<Flight> findByFromCityIgnoreCaseAndToCityIgnoreCase(String fromCity, String toCity);

    // Search by city name (partial match)
    @Query("SELECT f FROM Flight f WHERE LOWER(f.fromCity) LIKE LOWER(CONCAT('%', :city, '%')) " +
           "OR LOWER(f.toCity) LIKE LOWER(CONCAT('%', :city, '%'))")
    List<Flight> searchByCity(@Param("city") String city);
}
