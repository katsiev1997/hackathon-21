package org.hackathon21.backend.service;

import org.hackathon21.backend.dto.request.LoginRequest;
import org.hackathon21.backend.dto.request.RegisterRequest;
import org.hackathon21.backend.dto.response.AuthResponse;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.enums.UserRole;
import org.hackathon21.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordService passwordService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordService.hash(request.getPassword()))
                .name(request.getName())
                .role(UserRole.frontend)
                .lookingForTeam(true)
                .isOrganizer(false)
                .build();

        user = userRepository.save(user);

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole() != null ? user.getRole().name() : "frontend")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordService.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole() != null ? user.getRole().name() : "frontend")
                .build();
    }

