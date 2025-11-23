package com.gateway.gateway.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.dto.filme.EstatisticaResponse;
import com.gateway.gateway.dto.filme.FilmeRequest;
import com.gateway.gateway.dto.filme.FilmeResponse;
import com.gateway.gateway.service.FilmeGatewayService;
import com.gateway.gateway.util.FilmeModelAssembler;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class GatewayFilmeController {

    private final FilmeGatewayService service;
    private final FilmeModelAssembler filmeAssembler;

    @PostMapping
    public EntityModel<FilmeResponse> inserir(@RequestBody FilmeRequest request) {
        FilmeResponse created = service.inserir(request);
        return filmeAssembler.toModel(created);
    }

    @PutMapping("/{id}")
    public EntityModel<FilmeResponse> atualizar(@RequestBody FilmeRequest request, @PathVariable Integer id) {
        FilmeResponse updated = service.atualizar(request, id);
        return filmeAssembler.toModel(updated);
    }

    @DeleteMapping("/{id}")
    public EntityModel<?> deletar(@PathVariable Integer id) {
        service.deletar(id);
        // responder com um link para listagem
        return EntityModel.of(
                Map.of("message", "deletado"),
                linkTo(methodOn(GatewayFilmeController.class).listar(null, null, null)).withRel("filmes"));
    }

    @GetMapping("/{id}")
    public EntityModel<FilmeResponse> getById(@PathVariable Integer id) {
        FilmeResponse f = service.getById(id);
        return filmeAssembler.toModel(f);
    }

    @GetMapping
    public CollectionModel<EntityModel<FilmeResponse>> listar(
            @RequestParam(required = false) String pais,
            @RequestParam(required = false) String anoMinimo,
            @RequestParam(required = false) String notaMinima) {

        List<FilmeResponse> filmes = service.listarFiltrado(pais, anoMinimo, notaMinima);

        List<EntityModel<FilmeResponse>> models = filmes.stream()
                .map(filmeAssembler::toModel)
                .collect(Collectors.toList());

        CollectionModel<EntityModel<FilmeResponse>> collection = CollectionModel.of(models);
        // link para criar filme
        collection.add(linkTo(methodOn(GatewayFilmeController.class).inserir(null)).withRel("criar"));
        collection.add(linkTo(methodOn(GatewayFilmeController.class).estatisticas()).withRel("estatisticas"));

        return collection;
    }

    @GetMapping("/estatisticas")
    public CollectionModel<EntityModel<EstatisticaResponse>> estatisticas() {
        var stats = service.estatisticas();
        List<EntityModel<EstatisticaResponse>> models = stats.stream().map(s -> {
            EntityModel<EstatisticaResponse> m = EntityModel.of(s);
            m.add(linkTo(methodOn(GatewayFilmeController.class).listar(s.getPais(), null, null))
                    .withRel("filmes-por-pais"));
            return m;
        }).collect(Collectors.toList());
        return CollectionModel.of(models, linkTo(methodOn(GatewayFilmeController.class).estatisticas()).withSelfRel());
    }
}
