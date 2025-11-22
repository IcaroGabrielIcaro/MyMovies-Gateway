package com.gateway.gateway.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.gateway.gateway.dto.filme.FilmeRequest;
import com.gateway.gateway.util.JwtUserExtractor;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FilmeClient {

    private final RestTemplate restTemplate;
    private final JwtUserExtractor jwtUserExtractor;

    private final String SOAP_URL = "http://localhost:5000/";

    private String send(String xml) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_XML);

        HttpEntity<String> entity = new HttpEntity<>(xml, headers);

        return restTemplate.postForObject(SOAP_URL, entity, String.class);
    }

    public String inserir(FilmeRequest filme) {
        String userId = jwtUserExtractor.getUserId();

        String xml = """
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <inserirFilme>
                            <filme>
                                <id>0</id>
                                <titulo>%s</titulo>
                                <ano>%s</ano>
                                <pais>%s</pais>
                                <genero>%s</genero>
                                <review>%s</review>
                                <nota>%s</nota>
                                <id_usuario>%s</id_usuario>
                            </filme>
                        </inserirFilme>
                    </soap:Body>
                </soap:Envelope>
                """.formatted(
                filme.getTitulo(),
                filme.getAno(),
                filme.getPais(),
                filme.getGenero(),
                filme.getReview(),
                filme.getNota(),
                userId);
        return send(xml);
    }

    public String atualizar(FilmeRequest filme, Integer id) {
        String userId = jwtUserExtractor.getUserId();

        String xml = """
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <atualizarFilme>
                            <filme>
                                <id>%d</id>
                                <titulo>%s</titulo>
                                <ano>%s</ano>
                                <pais>%s</pais>
                                <genero>%s</genero>
                                <review>%s</review>
                                <nota>%s</nota>
                                <id_usuario>%s</id_usuario>
                            </filme>
                        </atualizarFilme>
                    </soap:Body>
                </soap:Envelope>
                """.formatted(
                id,
                filme.getTitulo(),
                filme.getAno(),
                filme.getPais(),
                filme.getGenero(),
                filme.getReview(),
                filme.getNota(),
                userId);
        return send(xml);
    }

    public String deletar(Integer id) {
        String xml = """
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <deletarFilme>
                            <id>%d</id>
                        </deletarFilme>
                    </soap:Body>
                </soap:Envelope>
                """.formatted(id);

        return send(xml);
    }

    public String getById(Integer id) {
        String xml = """
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <getFilme>
                            <id>%d</id>
                        </getFilme>
                    </soap:Body>
                </soap:Envelope>
                """.formatted(id);

        return send(xml);
    }

    public String listarTodos() {
        String xml = """
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <listarFilmes/>
                    </soap:Body>
                </soap:Envelope>
                """;

        return send(xml);
    }

    public String listarFiltrado(String pais, String anoMinimo, String notaMinima) {
        String userId = jwtUserExtractor.getUserId();

        StringBuilder builder = new StringBuilder();
        builder.append("""
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <listarFilmesFiltrados>
                """);

        // sempre incluir o id_usuario
        builder.append("<usuarioId>").append(userId).append("</usuarioId>");

        if (pais != null)
            builder.append("<pais>").append(pais).append("</pais>");
        if (anoMinimo != null)
            builder.append("<anoMinimo>").append(anoMinimo).append("</anoMinimo>");
        if (notaMinima != null)
            builder.append("<notaMinima>").append(notaMinima).append("</notaMinima>");

        builder.append("""
                        </listarFilmesFiltrados>
                    </soap:Body>
                </soap:Envelope>
                """);

        return send(builder.toString());
    }

    public String estatisticasPorPais() {
        String userId = jwtUserExtractor.getUserId();

        String xml = """
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <estatisticasPorPais>
                            <usuarioId>%s</usuarioId>
                        </estatisticasPorPais>
                    </soap:Body>
                </soap:Envelope>
                """.formatted(userId);

        return send(xml);
    }
}