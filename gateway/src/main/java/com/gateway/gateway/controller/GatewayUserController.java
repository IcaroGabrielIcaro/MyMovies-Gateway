package com.gateway.gateway.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.client.UserClient;
import com.gateway.gateway.dto.auth.UserRequest;
import com.gateway.gateway.dto.auth.UserResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Endpoints de gerenciamento de usuários via gateway")
public class GatewayUserController {

    private final UserClient userClient;

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        return userClient.pegar(id);
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return userClient.listarTodos();
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserRequest request) {
        return userClient.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userClient.deletar(id);
    }
}