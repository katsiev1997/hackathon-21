package org.hackathon21.backend.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException e) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (e.getMessage().contains("not found")) status = HttpStatus.NOT_FOUND;
        if (e.getMessage().contains("already")) status = HttpStatus.CONFLICT;
        if (e.getMessage().contains("forbidden") || e.getMessage().contains("only captain")) status = HttpStatus.FORBIDDEN;

        return ResponseEntity.status(status).body(Map.of("error", e.getMessage()));
    }
}