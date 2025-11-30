package com.gateway.gateway.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenInfoResponse {
    private String username;
    private String userId;
    private String message;
}
