package com.zelixa.zelixa.security;

import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.UserRepository;
import com.zelixa.zelixa.repository.RoleRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Fallback for different providers
        if (email == null)
            email = oAuth2User.getAttribute("preferred_username");
        if (email == null)
            email = oAuth2User.getAttribute("sub");
        if (name == null)
            name = oAuth2User.getAttribute("given_name");
        if (name == null)
            name = "User";

        String picture = oAuth2User.getAttribute("picture");
        if (picture == null)
            picture = oAuth2User.getAttribute("avatar_url");
        if (picture == null)
            picture = oAuth2User.getAttribute("picture_url");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update picture and name if changed
            user.setFullName(name);
            user.setProfilePicture(picture);
            userRepository.save(user);
        } else {
            // Register new user from Google
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setProfilePicture(picture);
            user.setPassword(""); // No password for OAuth users
            user.setIsActive(true);
            user.setRoles(Collections.singleton(roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."))));
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(new CustomUserDetails(user));

        // Redirect back to frontend with token
        String targetUrl = "http://localhost:3000/login/success?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
