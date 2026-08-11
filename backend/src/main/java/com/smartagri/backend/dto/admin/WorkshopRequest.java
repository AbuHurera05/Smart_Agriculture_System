package com.smartagri.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Instructor is required")
    private String instructor;
    
    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;
    
    @NotBlank(message = "Venue is required")
    private String venue;
    
    @NotBlank(message = "Type is required")
    private String type; // ONLINE, IN_PERSON
    
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
    
    private String price;
    
    private List<String> topics;
    
    private String prerequisites;
    
    private String status; // UPCOMING, ONGOING, COMPLETED, CANCELLED
}