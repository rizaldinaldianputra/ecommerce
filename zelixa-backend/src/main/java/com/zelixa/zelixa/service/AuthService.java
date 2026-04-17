package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.AuthResponse;
import com.zelixa.zelixa.dto.LoginRequest;
import com.zelixa.zelixa.dto.RegisterRequest;
import com.zelixa.zelixa.entity.Role;
import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.RoleRepository;
import com.zelixa.zelixa.repository.UserRepository;
import com.zelixa.zelixa.security.CustomUserDetails;
import com.zelixa.zelixa.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    @Transactional
    public void requestOtp(String phoneNumber) {
        otpService.generateOtp(phoneNumber);
    }

    @Transactional
    public AuthResponse loginWithOtp(String phoneNumber, String code) {
        if (!otpService.verifyOtp(phoneNumber, code)) {
            throw new IllegalArgumentException("Invalid or expired OTP code.");
        }

        User user = userRepository.findByPhoneNumber(phoneNumber).orElseGet(() -> {
            // Auto-register new user via OTP
            Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("ROLE_USER");
                return roleRepository.save(newRole);
            });

            User newUser = User.builder()
                    .phoneNumber(phoneNumber)
                    .email(phoneNumber + "@zelixa.com") // Fallback email
                    .password("") // OTP users don't have passwords
                    .roles(Collections.singleton(userRole))
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // Generate Token
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return mapToAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        // Fetch or create default USER role
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
            Role newRole = new Role();
            newRole.setName("ROLE_USER");
            return roleRepository.save(newRole);
        });

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .roles(Collections.singleton(userRole))
                .build();

        userRepository.save(user);

        // Generate Token
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return mapToAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        // Generate Token
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);

        return mapToAuthResponse(user, token);
    }

    public AuthResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return mapToAuthResponse(user, null);
    }

    private AuthResponse mapToAuthResponse(User user, String token) {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePicture(user.getProfilePicture())
                .roles(roleNames)
                .build();
    }
}
