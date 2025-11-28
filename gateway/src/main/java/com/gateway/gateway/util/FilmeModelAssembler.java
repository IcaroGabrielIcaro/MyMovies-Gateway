package com.gateway.gateway.util;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.stereotype.Component;

import com.gateway.gateway.controller.GatewayMovieController;
import com.gateway.gateway.dto.filme.MovieResponse;

@Component
public class FilmeModelAssembler implements RepresentationModelAssembler<MovieResponse, EntityModel<MovieResponse>> {

    @Override
    public EntityModel<MovieResponse> toModel(MovieResponse filme) {
        EntityModel<MovieResponse> model = EntityModel.of(filme,
                linkTo(methodOn(GatewayMovieController.class).getById(filme.getId())).withSelfRel(),
                linkTo(methodOn(GatewayMovieController.class).listar(null, null, null)).withRel("filmes"));

        // adicionar link de update/delete se desejar
        model.add(linkTo(methodOn(GatewayMovieController.class).atualizar(null, filme.getId())).withRel("update"));
        model.add(linkTo(methodOn(GatewayMovieController.class).deletar(filme.getId())).withRel("delete"));

        return model;
    }
}
