package com.authentication.authentication.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.authentication.authentication.dto.UserRequest;
import com.authentication.authentication.dto.UserResponse;
import com.authentication.authentication.mapper.UserMapper;
import com.authentication.authentication.model.User;
import com.authentication.authentication.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;

    public UserResponse getById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return mapper.toResponse(user);
    }

    public UserResponse update(Long id, UserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setDescricao(request.getDescricao());
        user.setFotoPerfilUrl(request.getFotoPerfilUrl());
        user.setFotoBannerUrl(request.getFotoBannerUrl());
        user.setGenerosPreferidos(request.getGenerosPreferidos());

        repository.save(user);

        return mapper.toResponse(user);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<UserResponse> listAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}
