package com.gateway.gateway.dto.filme;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {

    public enum Genero {
        acao,
        aventura,
        comedia,
        drama,
        ficcao,
        terror,
        suspense,
        animacao,
        documentario,
        romance,
        fantasia
    }

    private String nome;
    private String diretor;
    private String review;
    private Genero genero;

    private Integer nota;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate data_assistida;

    private Integer duracao;

    private boolean favorito;
    private String foto;
    private String poster;
    private Integer ano;
    private String nacionalidade;
}
