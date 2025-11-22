package com.gateway.gateway.dto.filme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilmeRequest {
    private String titulo;
    private String ano;
    private String pais;
    private String genero;
    private String review;
    private String nota;
}
