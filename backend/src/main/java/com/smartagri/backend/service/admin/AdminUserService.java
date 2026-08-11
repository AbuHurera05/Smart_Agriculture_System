package com.smartagri.backend.service.admin;

import com.smartagri.backend.dto.UserDto;
import com.smartagri.backend.dto.admin.UserUpdateRequest;
import com.smartagri.backend.entity.Role;
import com.smartagri.backend.entity.User;
import com.smartagri.backend.exception.BusinessException;
import com.smartagri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::mapToUserDto);
    }

    public Page<UserDto> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(
                searchTerm, searchTerm, pageable)
                .map(this::mapToUserDto);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found with id: " + id));
        return mapToUserDto(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found with id: " + id));

        // Check if email is being changed and if it's already taken
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BusinessException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }

        if (request.getFarmSize() != null) {
            user.setFarmSize(request.getFarmSize());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        log.info("User updated: {}", user.getEmail());
        return mapToUserDto(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found with id: " + id));
        
        // Soft delete - just deactivate
        user.setIsActive(false);
        userRepository.save(user);
        
        // For hard delete, use:
        // userRepository.delete(user);
        
        log.info("User deactivated: {}", user.getEmail());
    }

    @Transactional
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("User not found with id: " + id));
        user.setIsActive(true);
        userRepository.save(user);
        log.info("User activated: {}", user.getEmail());
    }

    public long getUserCount() {
        return userRepository.count();
    }

    public long getActiveUserCount() {
        return userRepository.countByIsActiveTrue();
    }

    public long getUserCountByRole(Role role) {
        return userRepository.countByRole(role);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .location(user.getLocation())
                .farmSize(user.getFarmSize())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}