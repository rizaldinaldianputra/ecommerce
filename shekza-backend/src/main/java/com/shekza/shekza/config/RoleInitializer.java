package com.shekza.shekza.config;

import com.shekza.shekza.entity.Role;
import com.shekza.shekza.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        ensureRole("ROLE_ADMIN");
        ensureRole("ROLE_USER");
        ensureRole("ROLE_CUSTOMER_SERVICE");
        ensureRole("ROLE_SHIPPING");
    }

    private void ensureRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            roleRepository.save(Role.builder().name(roleName).build());
        }
    }
}
