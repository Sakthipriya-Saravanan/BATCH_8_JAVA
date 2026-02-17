package com.campus.controller;

import com.campus.entity.User;
import com.campus.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Demo login endpoint.
     * Accepts { "email": "...", "role": "STUDENT|STAFF|ADMIN" }
     * If user exists by email, returns their data.
     * If not, creates a demo user with the given role.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String role = request.get("role");

        if (email == null || email.isBlank()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Email is required");
            return ResponseEntity.badRequest().body(error);
        }

        if (role == null || role.isBlank()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Role is required");
            return ResponseEntity.badRequest().body(error);
        }

        // Try to find existing user by email
        Optional<User> existing = userRepository.findByEmail(email);
        User user;

        if (existing.isPresent()) {
            user = existing.get();
        } else {
            // Create a demo user
            user = new User();
            user.setEmail(email);
            user.setName(email.split("@")[0]); // derive name from email
            user.setRole(User.Role.valueOf(role.toUpperCase()));
            user.setStatus(User.Status.ACTIVE);
            user = userRepository.save(user);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        return ResponseEntity.ok(response);
    }
}
