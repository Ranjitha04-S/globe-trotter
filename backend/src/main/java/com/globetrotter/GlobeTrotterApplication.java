package com.globetrotter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ─── Entry Point ──────────────────────────────────────────────────────────────
// This is where the Spring Boot app starts.
// @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
@SpringBootApplication
public class GlobeTrotterApplication {

    public static void main(String[] args) {
        SpringApplication.run(GlobeTrotterApplication.class, args);
        System.out.println("✈️  GlobeTrotter Backend is running on http://localhost:8080");
    }
}
