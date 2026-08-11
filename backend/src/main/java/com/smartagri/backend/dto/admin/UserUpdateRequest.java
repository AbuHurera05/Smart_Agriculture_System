package com.smartagri.backend.dto.admin;

import com.smartagri.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    
    private String name;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String phone;
    
    private String location;
    
    private String farmSize;
    
    private Role role;
    
    private Boolean isActive;
    
    private String specialization; // For experts
    
    private String experience; // For experts
}