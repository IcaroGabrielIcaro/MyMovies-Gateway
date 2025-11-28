package com.gateway.gateway.client;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.gateway.gateway.dto.filme.LikeResponse;
import com.gateway.gateway.dto.filme.StatusResponse;
import com.gateway.gateway.dto.filme.MovieRequest;
import com.gateway.gateway.dto.filme.MovieResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MovieClient {

    private final RestTemplate restTemplate;

    @Value("${services.movie.url}")
    private String BASE_URL;

    public List<MovieResponse> listarComFiltros(
            String nome,
            String diretor,
            String genero,
            String nacionalidade,
            Integer ano,
            Long idUsuario,
            Integer duracao,
            Boolean favorito) {

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(BASE_URL + "/api/movies/");

        if (nome != null)
            uriBuilder.queryParam("nome", nome);

        if (diretor != null)
            uriBuilder.queryParam("diretor", diretor);

        if (genero != null)
            uriBuilder.queryParam("genero", genero);

        if (nacionalidade != null)
            uriBuilder.queryParam("nacionalidade", nacionalidade);

        if (ano != null)
            uriBuilder.queryParam("ano", ano);

        if (idUsuario != null)
            uriBuilder.queryParam("id_usuario", idUsuario);

        if (duracao != null)
            uriBuilder.queryParam("duracao", duracao);

        if (favorito != null)
            uriBuilder.queryParam("favorito", favorito);

        ResponseEntity<MovieResponse[]> response = restTemplate.getForEntity(
                uriBuilder.toUriString(),
                MovieResponse[].class);

        return Arrays.asList(response.getBody());
    }

    public MovieResponse criar(MovieRequest req, Long idUsuario) {

        Map<String, Object> body = new HashMap<>();
        body.put("nome", req.getNome());
        body.put("diretor", req.getDiretor());
        body.put("review", req.getReview());
        body.put("genero", req.getGenero());
        body.put("nota", req.getNota());
        body.put("data_assistida", req.getData_assistida() != null ? req.getData_assistida().toString() : null);
        body.put("duracao", req.getDuracao());
        body.put("favorito", req.isFavorito());
        body.put("foto", req.getFoto());
        body.put("poster", req.getPoster());
        body.put("ano", req.getAno());
        body.put("nacionalidade", req.getNacionalidade());
        body.put("id_usuario", idUsuario);

        ResponseEntity<MovieResponse> response = restTemplate.postForEntity(
                BASE_URL + "/api/movies/",
                body,
                MovieResponse.class);

        return response.getBody();
    }

    public MovieResponse pegar(Long id) {
        return restTemplate.getForObject(
                BASE_URL + "/api/movies/" + id + "/",
                MovieResponse.class);
    }

    public MovieResponse atualizar(Long id, MovieRequest req, Long idUsuario) {

        Map<String, Object> body = new HashMap<>();
        body.put("nome", req.getNome());
        body.put("diretor", req.getDiretor());
        body.put("review", req.getReview());
        body.put("genero", req.getGenero());
        body.put("nota", req.getNota());
        body.put("data_assistida", req.getData_assistida() != null ? req.getData_assistida().toString() : null);
        body.put("duracao", req.getDuracao());
        body.put("favorito", req.isFavorito());
        body.put("foto", req.getFoto());
        body.put("poster", req.getPoster());
        body.put("ano", req.getAno());
        body.put("nacionalidade", req.getNacionalidade());
        body.put("id_usuario", idUsuario);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<MovieResponse> response = restTemplate.exchange(
                BASE_URL + "/api/movies/" + id + "/",
                HttpMethod.PUT,
                entity,
                MovieResponse.class);

        return response.getBody();
    }

    public void deletar(Long id) {
        restTemplate.delete(
                BASE_URL + "/api/movies/" + id + "/");
    }

    public MovieResponse favoritar(Long id, boolean favorito) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = String.format("{\"favorito\": %s}", favorito);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<MovieResponse> response = restTemplate.exchange(
                BASE_URL + "/api/movies/" + id + "/favorito/",
                HttpMethod.PATCH,
                entity,
                MovieResponse.class);

        return response.getBody();
    }

    public StatusResponse curtir(Long id_filme, Long id_usuario) {
        Map<String, Object> body = new HashMap<>();
        body.put("id_usuario", id_usuario);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<StatusResponse> response = restTemplate.exchange(
                BASE_URL + "/api/movies/" + id_filme + "/like/",
                HttpMethod.POST,
                entity,
                StatusResponse.class);

        return response.getBody();
    }

    public StatusResponse descurtir(Long id_filme, Long id_usuario) {
        Map<String, Object> body = new HashMap<>();
        body.put("id_usuario", id_usuario);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<StatusResponse> response = restTemplate.exchange(
                BASE_URL + "/api/movies/" + id_filme + "/like/",
                HttpMethod.DELETE,
                entity,
                StatusResponse.class);

        return response.getBody();
    }

    public List<LikeResponse> listarCurtidas(Long id_filme) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<LikeResponse>> response = restTemplate.exchange(
                BASE_URL + "/api/movies/" + id_filme + "/likes/",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<LikeResponse>>() {
                });

        return response.getBody();
    }
}