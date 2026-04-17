package org.hackathon21.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hackathon21.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class CurrentUserIdResolver {

    private final UserRepository userRepository;

    /** ID пользователя из JWT (subject = email), без заголовка X-User-ID. */
    public UUID requireCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[current-user] authentication=null или не аутентифицирован");
            throw new RuntimeException("User not found");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
