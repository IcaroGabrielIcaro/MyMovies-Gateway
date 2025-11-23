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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Tag(name = "Filmes", description = "Endpoints do gateway para CRUD de filmes e estatísticas, comunicando-se com o microserviço SOAP.")
public class GatewayFilmeController {

    private final FilmeGatewayService service;
    private final FilmeModelAssembler filmeAssembler;

    @Operation(summary = "Criar novo filme", description = "Envia um novo filme para o microserviço SOAP e retorna a representação HATEOAS do recurso criado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Filme criado com sucesso", content = @Content(schema = @Schema(implementation = FilmeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida ou campos faltando"),
            @ApiResponse(responseCode = "500", description = "Erro interno ao comunicar com o microserviço SOAP")
    })
    @PostMapping
    public EntityModel<FilmeResponse> inserir(
            @RequestBody @Schema(description = "Dados para criação do filme") FilmeRequest request) {
        FilmeResponse created = service.inserir(request);
        return filmeAssembler.toModel(created);
    }

    @Operation(summary = "Atualizar filme", description = "Atualiza os dados de um filme existente no microserviço SOAP.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Filme atualizado com sucesso", content = @Content(schema = @Schema(implementation = FilmeResponse.class))),
            @ApiResponse(responseCode = "404", description = "Filme não encontrado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PutMapping("/{id}")
    public EntityModel<FilmeResponse> atualizar(
            @RequestBody @Schema(description = "Dados atualizados do filme") FilmeRequest request,
            @PathVariable @Parameter(description = "ID do filme a ser atualizado") Integer id) {
        FilmeResponse updated = service.atualizar(request, id);
        return filmeAssembler.toModel(updated);
    }

    @Operation(summary = "Excluir filme", description = "Remove um filme pelo ID e retorna link para listagem.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Filme deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Filme não encontrado")
    })
    @DeleteMapping("/{id}")
    public EntityModel<?> deletar(
            @PathVariable @Parameter(description = "ID do filme") Integer id) {
        service.deletar(id);

        return EntityModel.of(
                Map.of("message", "deletado"),
                linkTo(methodOn(GatewayFilmeController.class).listar(null, null, null))
                        .withRel("filmes"));
    }

    @Operation(summary = "Buscar filme por ID", description = "Retorna um único filme com base no ID informado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Filme encontrado", content = @Content(schema = @Schema(implementation = FilmeResponse.class))),
            @ApiResponse(responseCode = "404", description = "Filme não encontrado")
    })
    @GetMapping("/{id}")
    public EntityModel<FilmeResponse> getById(
            @PathVariable @Parameter(description = "ID do filme") Integer id) {
        FilmeResponse f = service.getById(id);
        return filmeAssembler.toModel(f);
    }

    @Operation(summary = "Listar filmes", description = "Retorna lista de filmes. Aceita filtros opcionais por país, ano mínimo e nota mínima.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = FilmeResponse.class)))
    })
    @GetMapping
    public CollectionModel<EntityModel<FilmeResponse>> listar(
            @RequestParam(required = false) @Parameter(description = "Filtrar filmes por país") String pais,
            @RequestParam(required = false) @Parameter(description = "Filtrar filmes por ano mínimo") String anoMinimo,
            @RequestParam(required = false) @Parameter(description = "Filtrar filmes por nota mínima") String notaMinima) {

        List<FilmeResponse> filmes = service.listarFiltrado(pais, anoMinimo, notaMinima);

        List<EntityModel<FilmeResponse>> models = filmes.stream()
                .map(filmeAssembler::toModel)
                .collect(Collectors.toList());

        CollectionModel<EntityModel<FilmeResponse>> collection = CollectionModel.of(models);

        collection.add(linkTo(methodOn(GatewayFilmeController.class).inserir(null)).withRel("criar"));
        collection.add(linkTo(methodOn(GatewayFilmeController.class).estatisticas()).withRel("estatisticas"));

        return collection;
    }

    @Operation(summary = "Estatísticas de filmes", description = "Retorna estatísticas agregadas de filmes por país do usuário logado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estatísticas retornadas com sucesso", content = @Content(schema = @Schema(implementation = EstatisticaResponse.class)))
    })
    @GetMapping("/estatisticas")
    public CollectionModel<EntityModel<EstatisticaResponse>> estatisticas() {

        var stats = service.estatisticas();

        List<EntityModel<EstatisticaResponse>> models = stats.stream().map(s -> {
            EntityModel<EstatisticaResponse> m = EntityModel.of(s);
            m.add(
                    linkTo(methodOn(GatewayFilmeController.class).listar(s.getPais(), null, null))
                            .withRel("filmes-por-pais"));
            return m;
        }).collect(Collectors.toList());

        return CollectionModel.of(
                models,
                linkTo(methodOn(GatewayFilmeController.class).estatisticas()).withSelfRel());
    }
}
