package com.example.freelancer_marketplace.service;

import com.example.freelancer_marketplace.model.Bid;
import com.example.freelancer_marketplace.repos.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    public List<Bid> getAllBids() {
        return bidRepository.findAll();
    }

    public List<Bid> getBidsByProject(Long projectId) {
        return bidRepository.findByProjectId(projectId);
    }

    public List<Bid> getBidsByUser(Long userId) {
        return bidRepository.findByUserId(userId);
    }

    public Optional<Bid> getBidById(Long id) {
        return bidRepository.findById(id);
    }

    public Bid saveBid(Bid bid) {
        return bidRepository.save(bid);
    }

    public void deleteBid(Long id) {
        bidRepository.deleteById(id);
    }
    public void deleteBidsByProject(Long projectId) {
        List<Bid> projectBids = bidRepository.findByProjectId(projectId);
        bidRepository.deleteAll(projectBids);
    }
}
