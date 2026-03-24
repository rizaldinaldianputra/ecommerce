package com.shekza.shekza.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final OAuth2SuccessHandler oAuth2SuccessHandler;
        private final UserDetailsService userDetailsService;
        private final PasswordEncoder passwordEncoder;
        private final ClientRegistrationRepository clientRegistrationRepository;

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
                authProvider.setUserDetailsService(userDetailsService);
                authProvider.setPasswordEncoder(passwordEncoder);
                return authProvider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(auth -> auth
                                                // Public documentation and Swagger UI
                                                .requestMatchers(
                                                                "/v3/api-docs",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-resources/**",
                                                                "/webjars/**")
                                                .permitAll()
                                                // Public auth and registration
                                                .requestMatchers(
                                                                "/api/v1/auth/register",
                                                                "/api/v1/auth/login",
                                                                "/v1/auth/**",
                                                                "/api/v1/admin/auth/**",
                                                                "/login/**",
                                                                "/oauth2/**")
                                                .permitAll()
                                                // Public product, category and upload APIs
                                                .requestMatchers(
                                                                "/api/v1/products/**",
                                                                "/api/v1/categories/**",
                                                                "/api/v1/upload/**",
                                                                "/uploads/**",
                                                                "/actuator/health",
                                                                "/error/**",
                                                                "/error")
                                                .permitAll()
                                                // Any other request must be authenticated
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .oauth2Login(oauth2 -> oauth2
                                                .authorizationEndpoint(authorization -> authorization
                                                                .authorizationRequestResolver(
                                                                                new CustomOAuth2AuthorizationRequestResolver(
                                                                                                clientRegistrationRepository)))
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(new DefaultOAuth2UserService()))
                                                .successHandler(oAuth2SuccessHandler))
                                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Allow Next.js frontend
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
