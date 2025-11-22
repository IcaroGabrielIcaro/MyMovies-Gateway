package com.gateway.gateway.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.client.AuthClient;
import com.gateway.gateway.dto.auth.LoginRequest;
import com.gateway.gateway.dto.auth.RegisterRequest;
import com.gateway.gateway.dto.auth.TokenResponse;
import com.gateway.gateway.dto.auth.UserResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class GatewayAuthController {

    private final AuthClient authclient;

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return authclient.register(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {
        return authclient.login(request);
    }
}
