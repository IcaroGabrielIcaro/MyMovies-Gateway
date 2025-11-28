package com.authentication.authentication.service;

import java.time.Instant;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import com.authentication.authentication.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        long expiratesIn = 3600L;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("authentication")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiratesIn))
                .subject(authentication.getName())
                .claim("id_usuario", ((User) authentication.getPrincipal()).getId())
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String extractUsername(String token) {
        try {
            Jwt jwt = decoder.decode(token);
            return jwt.getSubject();
        } catch (JwtException e) {
            throw new RuntimeException("Token inválido: " + e.getMessage());
        }
    }

    public String extractUserId(String token) {
        try {
            Jwt jwt = decoder.decode(token);
            return jwt.getClaimAsString("id_usuario");
        } catch (JwtException e) {
            throw new RuntimeException("Token inválido: " + e.getMessage());
        }
    }

    public boolean isTokenValid(String token) {
        try {
            Jwt jwt = decoder.decode(token);
            return jwt.getExpiresAt() != null &&
                    jwt.getExpiresAt().isAfter(Instant.now());
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean isTokenValid(String token, String username) {
        try {
            Jwt jwt = decoder.decode(token);
            String tokenUsername = jwt.getSubject();
            boolean notExpired = jwt.getExpiresAt() != null &&
                    jwt.getExpiresAt().isAfter(Instant.now());

            return notExpired && username.equals(tokenUsername);
        } catch (JwtException e) {
            return false;
        }
    }
}
