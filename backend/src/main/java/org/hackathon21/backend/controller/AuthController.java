package org.hackathon21.backend.controller;

import org.hackathon21.backend.config.JwtService;
import org.hackathon21.backend.dto.request.LoginRequest;
import org.hackathon21.backend.dto.request.RegisterRequest;
import org.hackathon21.backend.dto.response.AuthResponse;
import org.hackathon21.backend.dto.response.LoginResponse;
import org.hackathon21.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        LoginResponse loginResponse = LoginResponse.builder()
                .id(authResponse.getId())
                .email(authResponse.getEmail())
                .name(authResponse.getName())
                .token(jwtToken)
                .build();

        return ResponseEntity.ok(loginResponse);
    }
}