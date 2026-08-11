package com.smartagri.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CropRequest {
    
    @NotBlank(message = "Crop name is required")
    private String name;
    
    @NotBlank(message = "Season is required")
    private String season;
    
    @NotBlank(message = "Duration is required")
    private String duration;
    
    @NotBlank(message = "Water requirement is required")
    private String waterRequirement;
    
    @NotBlank(message = "Temperature range is required")
    private String tempRange;
    
    @NotBlank(message = "Soil type is required")
    private String soilType;
    
    private String yield;
    
    private String description;
    
    private String image;
    
    private String growingTips;
    
    private String commonDiseases;
    
    private String fertilizerRecommendation;
}