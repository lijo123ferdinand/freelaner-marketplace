package com.example.freelancer_marketplace.repos;

import com.example.freelancer_marketplace.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {
    
}
