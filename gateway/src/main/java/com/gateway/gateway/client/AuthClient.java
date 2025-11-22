package com.gateway.gateway.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.dto.auth.LoginRequest;
import com.gateway.gateway.dto.auth.RegisterRequest;
import com.gateway.gateway.dto.auth.TokenResponse;
import com.gateway.gateway.dto.auth.UserResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthClient {

    private final RestTemplate restTemplate;

    private final String BASE_URL = "http://localhost:8081/auth";

    public UserResponse register(RegisterRequest req) {
        return restTemplate.postForObject(
                BASE_URL + "/register",
                req,
                UserResponse.class);
    }

    public TokenResponse login(LoginRequest req) {
        return restTemplate.postForObject(
                BASE_URL + "/login",
                req,
                TokenResponse.class);
    }
}
