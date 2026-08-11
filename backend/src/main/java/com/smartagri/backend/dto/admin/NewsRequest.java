package com.smartagri.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotBlank(message = "Summary is required")
    private String summary;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String author;
    
    private String imageUrl;
    
    private String status; // PUBLISHED, DRAFT, ARCHIVED
    
    private String source;
}