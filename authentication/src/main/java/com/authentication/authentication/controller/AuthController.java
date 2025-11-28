package com.authentication.authentication.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.authentication.authentication.dto.LoginRequest;
import com.authentication.authentication.dto.RegisterRequest;
import com.authentication.authentication.dto.TokenInfoResponse;
import com.authentication.authentication.dto.TokenResponse;
import com.authentication.authentication.dto.UserResponse;
import com.authentication.authentication.dto.ValidationResponse;
import com.authentication.authentication.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }

    @PostMapping("/validate-token")
    public ValidationResponse validateToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return service.validateToken(authHeader);
    }

    @PostMapping("/validate-token-for-user")
    public ValidationResponse validateTokenForUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String username) {
        return service.validateTokenForUser(authHeader, username);
    }

    @GetMapping("/token-info")
    public TokenInfoResponse getTokenInfo(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token inválido");
        }

        String token = authHeader.substring(7);

        return service.getTokenInfo(token);
    }
}
