package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.User;
import com.example.freelancer_marketplace.repos.UserRepository;
import com.example.freelancer_marketplace.security.JwtTokenProvider;
import com.example.freelancer_marketplace.security.PasswordHashing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordHashing passwordHashing;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            // Validate input
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            // Check if the user already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already taken");
            }

            // Hash the password before saving the user
            user.setPassword(passwordHashing.hashPassword(user.getPassword()));
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while registering the user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (PasswordHashing.verifyPassword(loginRequest.getPassword(), user.getPassword())) {
                String userType = user.getRole(); // Assuming role is stored in the User entity
                String token = jwtTokenProvider.createToken(user.getEmail(), userType);
                return ResponseEntity.ok(token);
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
    
}
