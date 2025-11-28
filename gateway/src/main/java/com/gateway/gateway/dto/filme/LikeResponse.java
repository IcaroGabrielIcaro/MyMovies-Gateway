package com.gateway.gateway.dto.filme;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponse {
    private Long id;
    private Long id_usuario;
    private Long filme;
    private OffsetDateTime created_at;
}
