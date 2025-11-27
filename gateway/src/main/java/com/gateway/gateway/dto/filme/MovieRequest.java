package com.gateway.gateway.dto.filme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {
    private String nome;
    private String review;
    private Integer nota;
    private String dataAssistida;
    private Boolean favorito;
    private String foto;
    private String temas;
    private Integer ano;
    private String poster;
    private String nacionalidade;
}