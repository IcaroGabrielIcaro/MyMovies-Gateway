package com.authentication.authentication.dto;

import java.util.List;

import com.authentication.authentication.model.GeneroPreferido;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String username;
    private String password;
    private String email;
    private String descricao;
    private String fotoPerfilUrl;
    private String fotoBannerUrl;
    private List<GeneroPreferido> generosPreferidos;
}
