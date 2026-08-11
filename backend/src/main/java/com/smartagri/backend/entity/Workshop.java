package com.smartagri.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workshops")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String instructor;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String type; // ONLINE, IN_PERSON

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "enrolled_count")
    private Integer enrolledCount = 0;

    private String price;

    @ElementCollection
    @CollectionTable(name = "workshop_topics", joinColumns = @JoinColumn(name = "workshop_id"))
    @Column(name = "topic")
    private List<String> topics = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String prerequisites;

    @Column(nullable = false)
    private String status; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}