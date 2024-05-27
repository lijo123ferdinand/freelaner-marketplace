package com.example.freelancer_marketplace.service;

import com.example.freelancer_marketplace.dto.UserDTO;
import com.example.freelancer_marketplace.model.User;
import com.example.freelancer_marketplace.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        // Check if a user with the same email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        // If user does not exist, save the new user
        return userRepository.save(user);
    }

     public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setRole(user.getRole());
        userDTO.setEmail(user.getEmail());
        // Set other fields as needed
        return userDTO;
    }
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Optionally, you can add methods to update, delete, or find a specific user
}
