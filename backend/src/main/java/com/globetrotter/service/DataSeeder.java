package com.globetrotter.service;

import com.globetrotter.model.Flight;
import com.globetrotter.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

// ─── DataSeeder ───────────────────────────────────────────────────────────────
// Runs once when the app starts. Seeds sample flight data into the database
// so the app is immediately usable without manual data entry.
// CommandLineRunner = Spring calls run() automatically after startup.
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public void run(String... args) {
        // Only seed if database is empty (avoid duplicates on restart)
        if (flightRepository.count() > 0) return;

        System.out.println("🌱 Seeding sample flight data...");

        List<Flight> flights = List.of(
            createFlight("AI-202", "Air India",     "Chennai",  "Delhi",     6, 8,  3500.0, 8500.0, 18000.0),
            createFlight("AI-505", "Air India",     "Mumbai",   "Bangalore", 7, 9,  2800.0, 7000.0, 15000.0),
            createFlight("6E-301", "IndiGo",        "Delhi",    "Mumbai",    5, 7,  2200.0, 6000.0, 12000.0),
            createFlight("6E-800", "IndiGo",        "Bangalore","Chennai",   8, 10, 1800.0, 5500.0, 11000.0),
            createFlight("SG-101", "SpiceJet",      "Kolkata",  "Delhi",     6, 9,  3000.0, 7500.0, 16000.0),
            createFlight("UK-901", "Vistara",       "Delhi",    "Goa",       7, 9,  3200.0, 8000.0, 17000.0),
            createFlight("QR-555", "Qatar Airways", "Delhi",    "Dubai",    14, 16, 8500.0, 22000.0, 55000.0),
            createFlight("EK-501", "Emirates",      "Mumbai",   "Dubai",    13, 15, 9000.0, 25000.0, 60000.0)
        );

        flightRepository.saveAll(flights);
        System.out.println("✅ Seeded " + flights.size() + " flights successfully!");
    }

    // Helper to create a Flight object cleanly
    private Flight createFlight(String number, String airline, String from, String to,
                                 int deptHour, int arrHour,
                                 double economy, double business, double first) {
        Flight f = new Flight();
        f.setFlightNumber(number);
        f.setAirline(airline);
        f.setFromCity(from);
        f.setToCity(to);
        f.setDepartureTime(LocalDateTime.now().plusDays(7).withHour(deptHour).withMinute(0));
        f.setArrivalTime(LocalDateTime.now().plusDays(7).withHour(arrHour).withMinute(30));
        f.setTotalSeats(180);
        f.setEconomyPrice(economy);
        f.setBusinessPrice(business);
        f.setFirstClassPrice(first);
        f.setAircraftType("BOEING_737");
        return f;
    }
}
