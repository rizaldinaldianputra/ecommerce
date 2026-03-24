package com.shekza.shekza.security;

import com.shekza.shekza.entity.Role;
import com.shekza.shekza.entity.User;
import com.shekza.shekza.repository.RoleRepository;
import com.shekza.shekza.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Initializing security data...");

        // Initialize Roles
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN");
        createRoleIfNotFound("ROLE_USER");

        // Initialize Admin User
        userRepository.findByEmail("admin@shekza.com").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("123456"));
                userRepository.save(admin);
                log.info("Updated existing admin user password: admin@shekza.com");
            },
            () -> {
                User admin = User.builder()
                        .email("admin@shekza.com")
                        .password(passwordEncoder.encode("123456"))
                        .fullName("System Administrator")
                        .isActive(true)
                        .roles(Collections.singleton(adminRole))
                        .build();
                userRepository.save(admin);
                log.info("Created default admin user: admin@shekza.com");
            }
        );
    }

    private Role createRoleIfNotFound(String name) {
        Optional<Role> role = roleRepository.findByName(name);
        if (role.isEmpty()) {
            Role newRole = Role.builder().name(name).build();
            log.info("Creating role: {}", name);
            return roleRepository.save(newRole);
        }
        return role.get();
    }
}
