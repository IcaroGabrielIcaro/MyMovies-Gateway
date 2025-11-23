package com.gateway.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.client.AuthClient;
import com.gateway.gateway.dto.auth.LoginRequest;
import com.gateway.gateway.dto.auth.RegisterRequest;
import com.gateway.gateway.dto.auth.TokenResponse;
import com.gateway.gateway.dto.auth.UserResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints responsáveis por cadastro e login de usuários por meio do gateway.")
public class GatewayAuthController {

    private final AuthClient authclient;

    @Operation(summary = "Cadastrar novo usuário", description = "Recebe os dados de cadastro e registra um novo usuário utilizando o microserviço de autenticação.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso", content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou usuário/email já existe"),
            @ApiResponse(responseCode = "500", description = "Erro interno ao processar o cadastro")
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @RequestBody @Schema(description = "Dados para criação de um novo usuário") RegisterRequest request) {
        return authclient.register(request);
    }

    @Operation(summary = "Realizar login", description = "Autentica um usuário com username e password. Retorna um token JWT em caso de sucesso.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso", content = @Content(schema = @Schema(implementation = TokenResponse.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (campos faltando ou incorretos)"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
            @ApiResponse(responseCode = "500", description = "Erro interno durante a autenticação")
    })
    @PostMapping("/login")
    public TokenResponse login(
            @RequestBody @Schema(description = "Credenciais de autenticação") LoginRequest request) {
        return authclient.login(request);
    }
}
