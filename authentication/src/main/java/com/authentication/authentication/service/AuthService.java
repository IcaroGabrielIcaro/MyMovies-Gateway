package com.authentication.authentication.service;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.authentication.authentication.dto.LoginRequest;
import com.authentication.authentication.dto.RegisterRequest;
import com.authentication.authentication.dto.TokenInfoResponse;
import com.authentication.authentication.dto.TokenResponse;
import com.authentication.authentication.dto.UserResponse;
import com.authentication.authentication.dto.ValidationResponse;
import com.authentication.authentication.mapper.UserMapper;
import com.authentication.authentication.model.User;
import com.authentication.authentication.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final UserMapper mapper;

    public UserResponse register(RegisterRequest request) {

        if (repository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Usuário já existe!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .email(request.getEmail())
                .build();

        repository.save(user);

        return mapper.toResponse(user);
    }

    public TokenResponse login(LoginRequest request) {

        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());

        String token = jwtService.generateToken(authentication);

        return new TokenResponse(token);
    }

    public ValidationResponse validateToken(String authHeader) {
        System.out.println("🔐 [AUTH DEBUG] validateToken chamado");
        System.out.println("🔐 [AUTH DEBUG] Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("🔐 [AUTH DEBUG] Token inválido - formato incorreto");
            return new ValidationResponse(false, "Token inválido - formato incorreto");
        }

        String token = authHeader.substring(7);

        try {
            String username = jwtService.extractUsername(token);

            boolean isValid = jwtService.isTokenValid(token);

            if (isValid) {
                return new ValidationResponse(true, "Token válido para usuário: " + username);
            } else {
                return new ValidationResponse(false, "Token expirado ou inválido");
            }

        } catch (Exception e) {
            return new ValidationResponse(false, "Token inválido: " + e.getMessage());
        }
    }

    public ValidationResponse validateTokenForUser(String authHeader, String expectedUsername) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ValidationResponse(false, "Token inválido - formato incorreto");
        }

        String token = authHeader.substring(7);

        try {
            boolean isValid = jwtService.isTokenValid(token, expectedUsername);

            if (isValid) {
                String username = jwtService.extractUsername(token);
                return new ValidationResponse(true, "Token válido para usuário: " + username);
            } else {
                return new ValidationResponse(false, "Token não corresponde ao usuário ou está expirado");
            }

        } catch (Exception e) {
            return new ValidationResponse(false, "Token inválido: " + e.getMessage());
        }
    }

    public TokenInfoResponse getTokenInfo(String token) {
        try {
            String username = jwtService.extractUsername(token);
            String userId = jwtService.extractUserId(token);

            return new TokenInfoResponse(username, userId, "Token válido");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao extrair informações do token: " + e.getMessage());
        }
    }
}
