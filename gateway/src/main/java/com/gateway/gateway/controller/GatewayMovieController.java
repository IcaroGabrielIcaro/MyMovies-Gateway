package com.gateway.gateway.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
import com.gateway.gateway.dto.filme.LikeResponse;
import com.gateway.gateway.dto.filme.MovieRequest;
import com.gateway.gateway.dto.filme.MovieResponse;
import com.gateway.gateway.dto.filme.StatusResponse;
import com.gateway.gateway.util.MovieModelAssembler;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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
        private final MovieModelAssembler assembler;

        @Operation(summary = "Criar novo filme", description = "Envia um novo filme para o microserviço SOAP e retorna a representação HATEOAS do recurso criado.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Filme criado com sucesso", content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Requisição inválida ou campos faltando"),
                        @ApiResponse(responseCode = "500", description = "Erro interno ao comunicar com o microserviço SOAP")
        })
        @PostMapping
        public EntityModel<MovieResponse> inserir(
                        @Parameter(description = "Dados para criação do filme", required = true) @RequestBody MovieRequest request,
                        @AuthenticationPrincipal Jwt jwt) {
                Long idUsuario = Long.valueOf(jwt.getClaim("id_usuario").toString());
                MovieResponse created = client.criar(request, idUsuario);
                return assembler.toModel(created);
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
                        @Parameter(description = "ID do filme a ser atualizado", required = true) @PathVariable Long id,
                        @AuthenticationPrincipal Jwt jwt) {
                Long idUsuario = Long.valueOf(jwt.getClaim("id_usuario").toString());
                MovieResponse updated = client.atualizar(id, request, idUsuario);
                return assembler.toModel(updated);
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
                                linkTo(methodOn(GatewayMovieController.class).listar(null, null, null, null, null, null,
                                                null, null))
                                                .withRel("filmes").withType("GET"));
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
                return assembler.toModel(f);
        }

        @Operation(summary = "Listar filmes", description = "Retorna lista de filmes com filtros opcionais")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso", content = @Content(schema = @Schema(implementation = MovieResponse.class)))
        })
        @GetMapping
        public CollectionModel<EntityModel<MovieResponse>> listar(
                        @Parameter(description = "Filtrar por nome") @RequestParam(required = false) String nome,
                        @Parameter(description = "Filtrar por diretor") @RequestParam(required = false) String diretor,
                        @Parameter(description = "Filtrar por gênero") @RequestParam(required = false) String genero,
                        @Parameter(description = "Filtrar por nacionalidade") @RequestParam(required = false) String nacionalidade,
                        @Parameter(description = "Filtrar por ano") @RequestParam(required = false) Integer ano,
                        @Parameter(description = "Filtrar por duração") @RequestParam(required = false) Integer duracao,
                        @Parameter(description = "Filtrar por favorito") @RequestParam(required = false) Boolean favorito,
                        @AuthenticationPrincipal Jwt jwt) {
                Long idUsuario = Long.valueOf(jwt.getClaim("id_usuario").toString());
                List<MovieResponse> filmes = client.listarComFiltros(nome, diretor, genero, nacionalidade, ano,
                                idUsuario, duracao, favorito);

                List<EntityModel<MovieResponse>> models = filmes.stream()
                                .map(assembler::toModel)
                                .collect(Collectors.toList());

                CollectionModel<EntityModel<MovieResponse>> collection = CollectionModel.of(models);

                collection.add(linkTo(methodOn(GatewayMovieController.class).inserir(null, null)).withRel("criar"));

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
                MovieResponse movie = client.favoritar(id, favorito);
                return assembler.toModel(movie);
        }

        @Operation(summary = "Curtir filme", description = "Adiciona uma curtida a um filme por um usuário.")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Filme curtido com sucesso", content = @Content(schema = @Schema(implementation = LikeResponse.class))),
                        @ApiResponse(responseCode = "200", description = "Filme já estava curtido", content = @Content(schema = @Schema(implementation = LikeResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado")
        })
        @PostMapping("/{id}/like")
        public StatusResponse curtir(
                        @Parameter(description = "ID do filme a ser curtido", required = true) @PathVariable Long id,
                        @AuthenticationPrincipal Jwt jwt) {
                Long idUsuario = Long.valueOf(jwt.getClaim("id_usuario").toString());
                return client.curtir(id, idUsuario);
        }

        @Operation(summary = "Descurtir filme", description = "Remove a curtida de um filme por um usuário.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Filme descurtido com sucesso", content = @Content(schema = @Schema(implementation = LikeResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado")
        })
        @DeleteMapping("/{id}/like")
        public StatusResponse descurtir(
                        @Parameter(description = "ID do filme a ser descurtido", required = true) @PathVariable Long id,
                        @AuthenticationPrincipal Jwt jwt) {
                Long idUsuario = Long.valueOf(jwt.getClaim("id_usuario").toString());
                return client.descurtir(id, idUsuario);
        }

        @Operation(summary = "Listar curtidas do filme", description = "Retorna todas as curtidas de um filme.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista de curtidas retornada com sucesso", content = @Content(array = @ArraySchema(schema = @Schema(implementation = LikeResponse.class)))),
                        @ApiResponse(responseCode = "404", description = "Filme não encontrado")
        })
        @GetMapping("/{id}/likes")
        public List<LikeResponse> listarCurtidas(
                        @Parameter(description = "ID do filme", required = true) @PathVariable Long id) {
                return client.listarCurtidas(id);
        }
}
