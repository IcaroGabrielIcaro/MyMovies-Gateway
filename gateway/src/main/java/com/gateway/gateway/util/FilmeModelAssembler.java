package com.gateway.gateway.util;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.stereotype.Component;

import com.gateway.gateway.controller.GatewayFilmeController;
import com.gateway.gateway.dto.filme.FilmeResponse;

@Component
public class FilmeModelAssembler implements RepresentationModelAssembler<FilmeResponse, EntityModel<FilmeResponse>> {

    @Override
    public EntityModel<FilmeResponse> toModel(FilmeResponse filme) {
        EntityModel<FilmeResponse> model = EntityModel.of(filme,
                linkTo(methodOn(GatewayFilmeController.class).getById(filme.getId())).withSelfRel(),
                linkTo(methodOn(GatewayFilmeController.class).listar(null, null, null)).withRel("filmes"),
                linkTo(methodOn(GatewayFilmeController.class).estatisticas()).withRel("estatisticas"));

        // adicionar link de update/delete se desejar
        model.add(linkTo(methodOn(GatewayFilmeController.class).atualizar(null, filme.getId())).withRel("update"));
        model.add(linkTo(methodOn(GatewayFilmeController.class).deletar(filme.getId())).withRel("delete"));

        return model;
    }
}
