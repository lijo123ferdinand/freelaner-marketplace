package com.example.freelancer_marketplace.repos;

import com.example.freelancer_marketplace.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProjectId(Long projectId);
    List<Bid> findByUserId(Long userId);
    List<Bid> findByUserIdAndStatus(Long userId, String status);

}
