package com.authentication.authentication.service;

import java.time.Instant;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.authentication.authentication.model.User;

@Service
public class JwtService {
    private final JwtEncoder encoder;

    public JwtService(JwtEncoder enconder) {
        this.encoder = enconder;
    }

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

}
