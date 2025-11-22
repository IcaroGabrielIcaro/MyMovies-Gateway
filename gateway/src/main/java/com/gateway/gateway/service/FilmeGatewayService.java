package com.gateway.gateway.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import com.gateway.gateway.client.FilmeClient;
import com.gateway.gateway.dto.filme.EstatisticaResponse;
import com.gateway.gateway.dto.filme.FilmeRequest;
import com.gateway.gateway.dto.filme.FilmeResponse;
import com.gateway.gateway.util.SoapXmlParser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FilmeGatewayService {

    private final FilmeClient client;
    private final SoapXmlParser parser;

    public FilmeResponse inserir(FilmeRequest request) {
        String xml = client.inserir(request);
        Document doc = parser.parse(xml);

        return mapFilme(parser.getRepeating(doc, "filme").get(0));
    }

    public FilmeResponse atualizar(FilmeRequest request, Integer id) {
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

    public FilmeResponse getById(Integer id) {
        String xml = client.getById(id);
        Document doc = parser.parse(xml);

        List<Document> filmes = parser.getRepeating(doc, "filme");
        if (filmes.isEmpty())
            return null;

        return mapFilme(filmes.get(0));
    }

    public List<FilmeResponse> listarTodos() {
        String xml = client.listarTodos();
        Document doc = parser.parse(xml);

        return parser.getRepeating(doc, "filme")
                .stream().map(this::mapFilme).toList();
    }

    public List<FilmeResponse> listarFiltrado(String pais, String anoMinimo, String notaMinima) {
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

    // ---- mappers ----

    private FilmeResponse mapFilme(Document doc) {
        return new FilmeResponse(
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
