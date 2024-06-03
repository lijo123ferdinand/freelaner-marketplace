package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.Bid;
import com.example.freelancer_marketplace.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @GetMapping
    public List<Bid> getAllBids() {
        return bidService.getAllBids();
    }

    @GetMapping("/project/{projectId}")
    public List<Bid> getBidsByProject(@PathVariable Long projectId) {
        return bidService.getBidsByProject(projectId);
    }

    @GetMapping("/user/{userId}")
    public List<Bid> getBidsByUser(@PathVariable Long userId) {
        return bidService.getBidsByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bid> getBidById(@PathVariable Long id) {
        Optional<Bid> bid = bidService.getBidById(id);
        return bid.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bid> createBid(@RequestBody Bid bid) {
        Bid savedBid = bidService.saveBid(bid);
        return ResponseEntity.ok(savedBid);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bid> updateBid(@PathVariable Long id, @RequestBody Bid bid) {
        Optional<Bid> existingBid = bidService.getBidById(id);
        if (existingBid.isPresent()) {
            bid.setId(id);
            Bid updatedBid = bidService.saveBid(bid);
            return ResponseEntity.ok(updatedBid);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable Long id) {
        bidService.deleteBid(id);
        return ResponseEntity.ok().build();
    }
}
