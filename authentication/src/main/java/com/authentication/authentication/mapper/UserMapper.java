package com.authentication.authentication.mapper;

import org.springframework.stereotype.Component;

import com.authentication.authentication.dto.UserRequest;
import com.authentication.authentication.dto.UserResponse;
import com.authentication.authentication.model.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        UserResponse dto = new UserResponse();

        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setDescricao(user.getDescricao());
        dto.setFotoPerfilUrl(user.getFotoPerfilUrl());
        dto.setFotoBannerUrl(user.getFotoBannerUrl());
        dto.setGenerosPreferidos(user.getGenerosPreferidos());

        return dto;
    }

    public User toEntity(UserRequest request) {
        return User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .email(request.getEmail())
                .descricao(request.getDescricao())
                .fotoPerfilUrl(request.getFotoPerfilUrl())
                .fotoBannerUrl(request.getFotoBannerUrl())
                .generosPreferidos(request.getGenerosPreferidos())
                .build();
    }
}
