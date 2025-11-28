package com.gateway.gateway.client;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.dto.filme.MovieRequest;
import com.gateway.gateway.dto.filme.MovieResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MovieClient {

    private final RestTemplate restTemplate;

    @Value("${services.movie.url}")
    private String BASE_URL;

    public List<MovieResponse> listar() {
        ResponseEntity<MovieResponse[]> response = restTemplate.getForEntity(
                BASE_URL + "/api/movies/",
                MovieResponse[].class);
        return Arrays.asList(response.getBody());
    }

    public MovieResponse criar(MovieRequest req) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MovieRequest> entity = new HttpEntity<>(req, headers);

        ResponseEntity<MovieResponse> response = restTemplate.postForEntity(
                BASE_URL + "/api/movies/",
                entity,
                MovieResponse.class);

        return response.getBody();
    }

    public MovieResponse pegar(Long id) {
        return restTemplate.getForObject(
                BASE_URL + "/api/movies/" + id + "/",
                MovieResponse.class);
    }

    public MovieResponse atualizar(Long id, MovieRequest req) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MovieRequest> entity = new HttpEntity<>(req, headers);

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
}