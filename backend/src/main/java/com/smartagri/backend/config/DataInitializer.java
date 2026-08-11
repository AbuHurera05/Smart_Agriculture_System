package com.smartagri.backend.config;

import com.smartagri.backend.entity.Role;
import com.smartagri.backend.entity.User;
import com.smartagri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default-email:admin@smartagri.com}")
    private String adminEmail;

    @Value("${admin.default-password:Admin@123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .name("System Administrator")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .location("Headquarters")
                    .build();
            
            userRepository.save(admin);
            log.info("Default admin user created: {}", adminEmail);
        }
    }
}