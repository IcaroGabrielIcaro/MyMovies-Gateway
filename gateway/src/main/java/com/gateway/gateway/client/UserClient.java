package com.gateway.gateway.client;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.dto.auth.UserRequest;
import com.gateway.gateway.dto.auth.UserResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserClient {

    private final RestTemplate restTemplate;

    @Value("${services.auth.url}")
    private String BASE_URL;

    public UserResponse pegar(Long id) {
        return restTemplate.getForObject(
                BASE_URL + "/users/" + id,
                UserResponse.class);
    }

    public List<UserResponse> listarTodos() {
        ResponseEntity<UserResponse[]> response = restTemplate.getForEntity(
                BASE_URL + "/users",
                UserResponse[].class);

        return Arrays.asList(response.getBody());
    }

    public UserResponse atualizar(Long id, UserRequest req) {

        Map<String, Object> body = new HashMap<>();
        body.put("username", req.getUsername());
        body.put("email", req.getEmail());
        body.put("descricao", req.getDescricao());
        body.put("fotoPerfilUrl", req.getFotoPerfilUrl());
        body.put("fotoBannerUrl", req.getFotoBannerUrl());
        body.put("generosPreferidos", req.getGenerosPreferidos());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<UserResponse> response = restTemplate.exchange(
                BASE_URL + "/users/" + id,
                HttpMethod.PUT,
                entity,
                UserResponse.class);

        return response.getBody();
    }

    public void deletar(Long id) {
        restTemplate.delete(
                BASE_URL + "/users/" + id);
    }
}
