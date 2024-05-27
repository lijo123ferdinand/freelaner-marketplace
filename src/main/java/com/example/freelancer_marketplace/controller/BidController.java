package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.dto.BidDTO;
import com.example.freelancer_marketplace.model.Bid;
import com.example.freelancer_marketplace.service.BidService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping("/project/{projectId}/user/{userId}")
    public ResponseEntity<?> createBid(@Valid @RequestBody Bid bid, @PathVariable Long projectId, @PathVariable Long userId) {
        try {
            Bid createdBid = bidService.createBid(bid, projectId, userId);
            return ResponseEntity.ok("createdBid");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
@GetMapping
    public ResponseEntity<List<BidDTO>> getAllBids() {
        List<BidDTO> bids = bidService.getAllBids();
        return ResponseEntity.ok(bids);
    }
}
