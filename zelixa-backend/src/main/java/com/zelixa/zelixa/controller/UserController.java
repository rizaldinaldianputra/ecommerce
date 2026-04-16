package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.UserRepository;
import com.zelixa.zelixa.entity.Role;
import com.zelixa.zelixa.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userRepository.findAll(PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        java.util.Set<Role> roles = new java.util.HashSet<>();
        if (request.getRoleNames() != null) {
            for (String roleName : request.getRoleNames()) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
        }
        if (roles.isEmpty()) {
            roleRepository.findByName("ROLE_USER").ifPresent(roles::add);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .taskGroup(request.getTaskGroup())
                .roles(roles)
                .isActive(true)
                .build();

        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/roles-groups")
    public ResponseEntity<User> updateRolesAndGroups(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleGroupRequest request) {

        return userRepository.findById(id).map(user -> {
            user.setTaskGroup(request.getTaskGroup());
            if (request.getRoleNames() != null) {
                java.util.Set<Role> newRoles = new java.util.HashSet<>();
                for (String roleName : request.getRoleNames()) {
                    roleRepository.findByName(roleName).ifPresent(newRoles::add);
                }
                user.setRoles(newRoles);
            }
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @lombok.Data
    public static class CreateUserRequest {
        private String email;
        private String password;
        private String fullName;
        private String taskGroup;
        private List<String> roleNames;
    }

    @lombok.Data
    public static class UpdateUserRoleGroupRequest {
        private String taskGroup;
        private List<String> roleNames;
    }
}
