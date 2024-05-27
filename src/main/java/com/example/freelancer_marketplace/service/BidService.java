package com.example.freelancer_marketplace.service;

import com.example.freelancer_marketplace.dto.BidDTO;
import com.example.freelancer_marketplace.model.Bid;
import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.model.User;
import com.example.freelancer_marketplace.repos.BidRepository;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import com.example.freelancer_marketplace.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Bid createBid(Bid bid, Long projectId, Long userId) {
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (projectOptional.isPresent() && userOptional.isPresent()) {
            bid.setProject(projectOptional.get());
            bid.setUser(userOptional.get());
            return bidRepository.save(bid);
        } else {
            throw new IllegalArgumentException("Project or User not found");
        }
    }
 
    

    public List<BidDTO> getAllBids() {
        List<Bid> bids = bidRepository.findAll();
        return bids.stream()
                   .map(this::convertToBidDTO)
                   .collect(Collectors.toList());
    }

    private BidDTO convertToBidDTO(Bid bid) {
        BidDTO bidDTO = new BidDTO();
        bidDTO.setId(bid.getId());
        bidDTO.setAmount(bid.getAmount());
        bidDTO.setProposal(bid.getProposal());
        // Set other fields as needed
        
        return bidDTO;
    }
}
