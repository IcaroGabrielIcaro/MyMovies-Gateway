package com.gateway.gateway.dto.filme;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstatisticaResponse {
    private String pais;
    private Integer quantidade;
}
