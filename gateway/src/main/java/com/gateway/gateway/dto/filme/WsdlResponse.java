package com.gateway.gateway.dto.filme;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WsdlResponse {
    private String serviceName;
    private String portTypeName;
    private List<String> operations;
    private String rawWsdl;
}
