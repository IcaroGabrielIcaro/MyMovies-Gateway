package com.gateway.gateway.dto.filme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private Long id;
    private String nome;
    private String diretor;
    private String review;
    private String genero;

    private Integer nota;

    private String data_assistida;

    private Integer duracao;

    private Boolean favorito;
    private String foto;
    private String poster;
    private Integer ano;
    private String nacionalidade;

    private Long id_usuario;
}
