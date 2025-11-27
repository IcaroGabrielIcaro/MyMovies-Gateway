package com.gateway.gateway.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import com.gateway.gateway.client.MovieClient;
import com.gateway.gateway.dto.filme.EstatisticaResponse;
import com.gateway.gateway.dto.filme.FilmeRequest;
import com.gateway.gateway.dto.filme.MovieResponse;
import com.gateway.gateway.dto.filme.WsdlResponse;
import com.gateway.gateway.util.SoapXmlParser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FilmeGatewayService {

    private final MovieClient client;
    private final SoapXmlParser parser;

    public MovieResponse inserir(FilmeRequest request) {
        String xml = client.inserir(request);
        Document doc = parser.parse(xml);

        return mapFilme(parser.getRepeating(doc, "filme").get(0));
    }

    public MovieResponse atualizar(FilmeRequest request, Integer id) {
        String xml = client.atualizar(request, id);
        Document doc = parser.parse(xml);

        return mapFilme(parser.getRepeating(doc, "filme").get(0));
    }

    public Map<String, String> deletar(Integer id) {
        String xml = client.deletar(id);
        Document doc = parser.parse(xml);

        String status = parser.getText(doc, "status");
        String mensagem = parser.getText(doc, "mensagem");

        return Map.of(
                "status", status,
                "mensagem", mensagem);
    }

    public MovieResponse getById(Integer id) {
        String xml = client.getById(id);
        Document doc = parser.parse(xml);

        List<Document> filmes = parser.getRepeating(doc, "filme");
        if (filmes.isEmpty())
            return null;

        return mapFilme(filmes.get(0));
    }

    public List<MovieResponse> listarTodos() {
        String xml = client.listarTodos();
        Document doc = parser.parse(xml);

        return parser.getRepeating(doc, "filme")
                .stream().map(this::mapFilme).toList();
    }

    public List<MovieResponse> listarFiltrado(String pais, String anoMinimo, String notaMinima) {
        String xml = client.listarFiltrado(pais, anoMinimo, notaMinima);
        Document doc = parser.parse(xml);

        return parser.getRepeating(doc, "filme")
                .stream().map(this::mapFilme).toList();
    }

    public List<EstatisticaResponse> estatisticas() {
        String xml = client.estatisticasPorPais();
        Document doc = parser.parse(xml);

        return parser.getRepeating(doc, "paisEstatistica")
                .stream().map(this::mapEstatistica).toList();
    }

    public WsdlResponse wsdl() {
        String wsdl = client.wsdl();
        Document doc = parser.parse(wsdl);
        String serviceName = parser.getSingle(doc, "definitions", "name");
        String portTypeName = parser.getSingle(doc, "portType", "name");

        List<Document> opsDocs = parser.getRepeating(doc, "operation");
        List<String> operations = opsDocs.stream()
                .map(d -> parser.getAttribute(d, "name"))
                .toList();

        // 6. retorna a resposta
        return new WsdlResponse(
                serviceName,
                portTypeName,
                operations,
                wsdl);
    }

    // ---- mappers ----

    private MovieResponse mapFilme(Document doc) {
        return new MovieResponse(
                Integer.valueOf(parser.getText(doc, "id")),
                parser.getText(doc, "titulo"),
                parser.getText(doc, "ano"),
                parser.getText(doc, "pais"),
                parser.getText(doc, "genero"),
                parser.getText(doc, "review"),
                parser.getText(doc, "nota"),
                parser.getText(doc, "id_usuario"));
    }

    private EstatisticaResponse mapEstatistica(Document doc) {
        return new EstatisticaResponse(
                parser.getText(doc, "pais"),
                Integer.valueOf(parser.getText(doc, "total")));
    }
}
