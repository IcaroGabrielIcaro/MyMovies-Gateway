package com.gateway.gateway.util;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.stereotype.Component;

import com.gateway.gateway.controller.GatewayMovieController;
import com.gateway.gateway.dto.filme.MovieResponse;

@Component
public class MovieModelAssembler implements RepresentationModelAssembler<MovieResponse, EntityModel<MovieResponse>> {

    @Override
    public EntityModel<MovieResponse> toModel(MovieResponse filme) {
        EntityModel<MovieResponse> model = EntityModel.of(filme,
                linkTo(methodOn(GatewayMovieController.class).getById(filme.getId())).withSelfRel().withType("GET"),
                linkTo(methodOn(GatewayMovieController.class).listar(null, null, null, null, null, null, null, null))
                        .withRel("filmes").withType("GET"));

        model.add(linkTo(methodOn(GatewayMovieController.class).atualizar(null, filme.getId(), null)).withRel("update")
                .withType("PUT"));
        model.add(linkTo(methodOn(GatewayMovieController.class).deletar(filme.getId())).withRel("delete")
                .withType("DELETE"));

        return model;
    }
}