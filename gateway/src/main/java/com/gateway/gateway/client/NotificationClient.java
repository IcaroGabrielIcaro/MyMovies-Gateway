package com.gateway.gateway.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.dto.notification.NotificationRequest;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationClient {

    private final RestTemplate restTemplate;

    @Value("${services.notification.url}")
    private String BASE_URL;

    public void enviarNotificacao(NotificationRequest request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<NotificationRequest> entity = new HttpEntity<>(request, headers);

        restTemplate.postForEntity(
                BASE_URL + "/api/notify",
                entity,
                Void.class);
    }
}
