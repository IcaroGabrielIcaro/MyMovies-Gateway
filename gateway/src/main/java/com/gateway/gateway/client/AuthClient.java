package com.gateway.gateway.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.dto.auth.LoginRequest;
import com.gateway.gateway.dto.auth.RegisterRequest;
import com.gateway.gateway.dto.auth.TokenInfoResponse;
import com.gateway.gateway.dto.auth.TokenResponse;
import com.gateway.gateway.dto.auth.UserResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthClient {

    private final RestTemplate restTemplate;

    @Value("${services.auth.url}")
    private String BASE_URL;

    public UserResponse register(RegisterRequest req) {
        return restTemplate.postForObject(
                BASE_URL + "/register",
                req,
                UserResponse.class);
    }

    public TokenResponse login(LoginRequest req) {

        TokenResponse tokenResponse = restTemplate.postForObject(
                BASE_URL + "/login",
                req,
                TokenResponse.class);

        String token = tokenResponse.getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<TokenInfoResponse> tokenInfoResponse = restTemplate.exchange(
                BASE_URL + "/token-info",
                HttpMethod.GET,
                entity,
                TokenInfoResponse.class);

        TokenInfoResponse info = tokenInfoResponse.getBody();

        return new TokenResponse(token, Long.valueOf(info.getUserId()));
    }
}
