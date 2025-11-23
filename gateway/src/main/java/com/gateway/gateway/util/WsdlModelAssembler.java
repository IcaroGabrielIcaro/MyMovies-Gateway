package com.gateway.gateway.util;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import com.gateway.gateway.dto.filme.WsdlResponse;

@Component
public class WsdlModelAssembler implements RepresentationModelAssembler<WsdlResponse, EntityModel<WsdlResponse>> {

    @Override
    public EntityModel<WsdlResponse> toModel(WsdlResponse wsdl) {
        return EntityModel.of(wsdl);
    }
}