package com.globetrotter.repository;

import com.globetrotter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// ─── UserRepository ───────────────────────────────────────────────────────────
// Spring Data JPA automatically implements all CRUD methods.
// We just define method signatures and Spring figures out the SQL!
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Spring generates: SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM users WHERE email = ?
    boolean existsByEmail(String email);
}
