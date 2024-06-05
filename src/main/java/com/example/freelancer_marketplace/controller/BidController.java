package com.example.freelancer_marketplace.controller;

import com.example.freelancer_marketplace.model.Bid;
import com.example.freelancer_marketplace.model.Project;
import com.example.freelancer_marketplace.repos.BidRepository;
import com.example.freelancer_marketplace.repos.ProjectRepository;
import com.example.freelancer_marketplace.service.BidService;
import com.example.freelancer_marketplace.service.ProjectService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private ProjectService projectService;
     @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private BidRepository bidRepository; // Assuming you have a BidRepository


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
    @PutMapping("/{id}/update-status")
    public ResponseEntity<Project> updateProjectStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Project updatedProject = projectService.updateProjectStatus(id, status);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/accepted-projects/user/{userId}")
    public ResponseEntity<List<Project>> getAcceptedProjectsByUserId(@PathVariable Long userId) {
        try {
            // Find bids with status "ACCEPTED" for the given user ID
            List<Bid> acceptedBids = bidRepository.findByUserIdAndStatus(userId, "ACCEPTED");

            // Extract the associated projects from the accepted bids
            List<Project> acceptedProjects = acceptedBids.stream()
                    .map(Bid::getProject)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(acceptedProjects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PutMapping("/{id}/accept")
    public ResponseEntity<Bid> acceptBid(@PathVariable Long id) {
        try {
            Optional<Bid> existingBid = bidService.getBidById(id);
            if (existingBid.isPresent()) {
                Bid bid = existingBid.get();
                // Set bid status to "ACCEPTED"
                bid.setStatus("ACCEPTED");
                Bid updatedBid = bidService.saveBid(bid);
                
                // Delete all other bids related to the same project
                List<Bid> projectBids = bidService.getBidsByProject(bid.getProject().getId());
                for (Bid otherBid : projectBids) {
                    if (!otherBid.getId().equals(id)) {
                        bidService.deleteBid(otherBid.getId());
                    }
                }
    
                return ResponseEntity.ok(updatedBid);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    


    @DeleteMapping("/{projectId}")
@Transactional
public ResponseEntity<?> deleteProjectAndBids(@PathVariable Long projectId) {
    try {
        // Find the project by ID
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        // Find all bids associated with the project
        List<Bid> bids = bidRepository.findByProjectId(projectId);

        // Delete each bid associated with the project
        for (Bid bid : bids) {
            bidRepository.delete(bid);
        }

        // Finally, delete the project
        projectRepository.delete(project);

        return ResponseEntity.ok().build();
    } catch (EntityNotFoundException ex) {
        return ResponseEntity.notFound().build();
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the project and its bids.");
    }
}

    // @DeleteMapping("/{projectId}")
    // @Transactional
    // public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
    //     try {
    //         // Find the project by ID
    //         Project project = projectRepository.findById(projectId)
    //                 .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

    //         // Find all bids associated with the project
    //         List<Bid> bids = bidRepository.findByProjectId(projectId);

    //         // Delete each bid associated with the project
    //         for (Bid bid : bids) {
    //             bidRepository.delete(bid);
    //         }

    //         // Finally, delete the project
    //         projectRepository.delete(project);

    //         return ResponseEntity.ok().build();
    //     } catch (EntityNotFoundException ex) {
    //         return ResponseEntity.notFound().build();
    //     } catch (Exception ex) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the project.");
    //     }
    // }
    @DeleteMapping("/project/{projectId}")
@Transactional
public ResponseEntity<?> deleteBidsByProjectId(@PathVariable Long projectId) {
    try {
        // Find all bids associated with the project
        List<Bid> bids = bidRepository.findByProjectId(projectId);

        // Delete each bid associated with the project
        for (Bid bid : bids) {
            bidRepository.delete(bid);
        }

        return ResponseEntity.ok().build();
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the bids for the project.");
    }
}

}
