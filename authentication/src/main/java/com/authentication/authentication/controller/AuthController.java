package com.authentication.authentication.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authentication.authentication.dto.LoginRequest;
import com.authentication.authentication.dto.RegisterRequest;
import com.authentication.authentication.dto.TokenResponse;
import com.authentication.authentication.dto.UserResponse;
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
}
