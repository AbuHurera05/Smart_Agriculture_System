package com.smartagri.backend.repository;

import com.smartagri.backend.entity.Role;
import com.smartagri.backend.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Add to existing UserRepository
Page<User> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(
    String email, String name, Pageable pageable);

long countByIsActiveTrue();

long countByRole(Role role);
}