package com.gateway.gateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.util.AuthForwardInterceptor;

@Configuration
public class RestConfig {
    @Bean
    public RestTemplate restTemplate(AuthForwardInterceptor interceptor) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setInterceptors(List.of(interceptor));
        return restTemplate;
    }
}
