package com.gateway.gateway.controller;

import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.dto.filme.WsdlResponse;
import com.gateway.gateway.service.FilmeGatewayService;
import com.gateway.gateway.util.WsdlModelAssembler;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wsdl")
@RequiredArgsConstructor
public class GatewayWsdlController {

    private final FilmeGatewayService service;
    private final WsdlModelAssembler assembler;

    @GetMapping
    public EntityModel<WsdlResponse> wsdl() {
        WsdlResponse wsdl = service.wsdl();
        return assembler.toModel(wsdl);
    }
}
