package com.example.freelancer_marketplace.repos;

import com.example.freelancer_marketplace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
