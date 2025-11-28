package com.gateway.gateway.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private Long curtidorId;
    private Long filmeId;
    private Long destinatarioId;
    private String tipo;
}
