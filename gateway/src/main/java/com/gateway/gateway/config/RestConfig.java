package com.gateway.gateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.util.AuthForwardInterceptor;

@Configuration
public class RestConfig {
    @Bean
    public RestTemplate restTemplate(AuthForwardInterceptor interceptor) {

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();

        RestTemplate restTemplate = new RestTemplate(factory);
        restTemplate.setInterceptors(List.of(interceptor));

        return restTemplate;
    }
}
