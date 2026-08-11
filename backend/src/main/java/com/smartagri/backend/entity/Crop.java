package com.smartagri.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "crops")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String season;

    @Column(nullable = false)
    private String duration;

    @Column(name = "water_requirement", nullable = false)
    private String waterRequirement;

    @Column(name = "temp_range", nullable = false)
    private String tempRange;

    @Column(name = "soil_type", nullable = false)
    private String soilType;

    @Column(name = "yield_per_acre")
    private String yield;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    @Column(name = "growing_tips", columnDefinition = "TEXT")
    private String growingTips;

    @Column(name = "common_diseases", columnDefinition = "TEXT")
    private String commonDiseases;

    @Column(name = "fertilizer_recommendation", columnDefinition = "TEXT")
    private String fertilizerRecommendation;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}