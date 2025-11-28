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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.gateway.client.MovieClient;
import com.gateway.gateway.dto.filme.MovieRequest;
import com.gateway.gateway.dto.filme.MovieResponse;
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
public class GatewayMovieController {

        private final MovieClient client;
        private final FilmeModelAssembler filmeAssembler;

        @Operation(summary = "Criar novo filme", description = "Envia um novo filme para o microserviço SOAP e retorna a representação HATEOAS do recurso criado.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Filme criado com sucesso", content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Requisição inválida ou campos faltando"),
                        @ApiResponse(responseCode = "500", description = "Erro interno ao comunicar com o microserviço SOAP")
        })
        @PostMapping
        public EntityModel<MovieResponse> inserir(
                        @Parameter(description = "Dados para criação do filme", required = true) @RequestBody MovieRequest request) {
                MovieResponse created = client.criar(request);
                return filmeAssembler.toModel(created);
        }

        @Operation(summary = "Atualizar filme", description = "Atualiza os dados de um filme existente no microserviço SOAP.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Filme atualizado com sucesso", content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado"),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos")
        })
        @PutMapping("/{id}")
        public EntityModel<MovieResponse> atualizar(
                        @Parameter(description = "Dados atualizados do filme", required = true) @RequestBody MovieRequest request,
                        @Parameter(description = "ID do filme a ser atualizado", required = true) @PathVariable Long id) {
                MovieResponse updated = client.atualizar(id, request);
                return filmeAssembler.toModel(updated);
        }

        @Operation(summary = "Excluir filme", description = "Remove um filme pelo ID e retorna link para listagem.")
        @ApiResponses({
                        @ApiResponse(responseCode = "204", description = "Filme deletado com sucesso"),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado")
        })
        @DeleteMapping("/{id}")
        public EntityModel<?> deletar(
                        @Parameter(description = "ID do filme a ser deletado", required = true) @PathVariable Long id) {
                client.deletar(id);

                return EntityModel.of(
                                Map.of("message", "deletado"),
                                linkTo(methodOn(GatewayMovieController.class).listar(null, null, null))
                                                .withRel("filmes"));
        }

        @Operation(summary = "Buscar filme por ID", description = "Retorna um único filme com base no ID informado.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Filme encontrado", content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado")
        })
        @GetMapping("/{id}")
        public EntityModel<MovieResponse> getById(
                        @Parameter(description = "ID do filme a ser buscado", required = true) @PathVariable Long id) {
                MovieResponse f = client.pegar(id);
                return filmeAssembler.toModel(f);
        }

        @Operation(summary = "Listar filmes", description = "Retorna lista de filmes. Aceita filtros opcionais por país, ano mínimo e nota mínima.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = MovieResponse.class)))
        })
        @GetMapping
        public CollectionModel<EntityModel<MovieResponse>> listar(
                        @Parameter(description = "Filtrar filmes por país") @RequestParam(required = false) String pais,
                        @Parameter(description = "Filtrar filmes por ano mínimo") @RequestParam(required = false) String anoMinimo,
                        @Parameter(description = "Filtrar filmes por nota mínima") @RequestParam(required = false) String notaMinima) {

                List<MovieResponse> filmes = client.listar();

                List<EntityModel<MovieResponse>> models = filmes.stream()
                                .map(filmeAssembler::toModel)
                                .collect(Collectors.toList());

                CollectionModel<EntityModel<MovieResponse>> collection = CollectionModel.of(models);

                collection.add(linkTo(methodOn(GatewayMovieController.class).inserir(null)).withRel("criar"));

                return collection;
        }

        @Operation(summary = "Favoritar/Desfavoritar filme", description = "Marca ou desmarca um filme como favorito.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Filme atualizado com sucesso", content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado")
        })
        @PatchMapping("/{id}/favorito")
        public EntityModel<MovieResponse> favoritar(
                        @Parameter(description = "ID do filme a ser atualizado", required = true) @PathVariable Long id,
                        @Parameter(description = "Definir se o filme é favorito (true/false)", required = true) @RequestParam boolean favorito) {
                MovieResponse updated = client.favoritar(id, favorito);
                return filmeAssembler.toModel(updated);
        }
}
