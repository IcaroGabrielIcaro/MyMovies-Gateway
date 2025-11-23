package com.gateway.gateway.controller;

import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.dto.filme.WsdlResponse;
import com.gateway.gateway.service.FilmeGatewayService;
import com.gateway.gateway.util.WsdlModelAssembler;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wsdl")
@RequiredArgsConstructor
@Tag(name = "WSDL", description = "Endpoint responsável por expor a definição WSDL do microserviço SOAP por meio do gateway.")
public class GatewayWsdlController {

    private final FilmeGatewayService service;
    private final WsdlModelAssembler assembler;

    @Operation(summary = "Obter WSDL do serviço SOAP", description = "Retorna o documento WSDL bruto, processado pelo gateway, contendo todas as operações e tipos do serviço SOAP.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "WSDL retornado com sucesso", content = @Content(schema = @Schema(implementation = WsdlResponse.class))),
            @ApiResponse(responseCode = "502", description = "Falha ao comunicar com o microserviço SOAP"),
            @ApiResponse(responseCode = "500", description = "Erro interno ao processar o documento WSDL")
    })
    @GetMapping
    public EntityModel<WsdlResponse> wsdl() {
        WsdlResponse wsdl = service.wsdl();
        return assembler.toModel(wsdl);
    }
}
