package com.gateway.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties("account.cors")
@Data
public class CorsProperties {
    private String allowedOriginPatterns;
}
