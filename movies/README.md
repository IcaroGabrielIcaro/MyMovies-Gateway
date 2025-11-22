# Comandos SOAP

## Inserir filme

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <inserirFilme>
            <filme>
                <id>10</id>
                <titulo>Oldboy</titulo>
                <ano>2003</ano>
                <pais>Coreia do Sul</pais>
                <genero>Thriller</genero>
                <review>Clássico do cinema coreano.</review>
                <nota>9.0</nota>
                <id_usuario>101</id_usuario>
            </filme>
        </inserirFilme>
    </soap:Body>
</soap:Envelope>
```

## Atualizar filme

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <atualizarFilme>
            <filme>
                <id>10</id>
                <titulo>Oldboy (Versão Restaurada)</titulo>
                <ano>2003</ano>
                <pais>Coreia do Sul</pais>
                <genero>Suspense</genero>
                <review>Obra-prima do cinema asiático.</review>
                <nota>9.3</nota>
                <id_usuario>101</id_usuario>
            </filme>
        </atualizarFilme>
    </soap:Body>
</soap:Envelope>

```

## Deletar filme

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <deletarFilme>
            <id>10</id>
        </deletarFilme>
    </soap:Body>
</soap:Envelope>
```

## Pegar filme por ID

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getFilme>
      <id>1</id>
    </getFilme>
  </soap:Body>
</soap:Envelope>
```

## Listar filmes (sem filtros)

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmes/>
  </soap:Body>
</soap:Envelope>
```

## Listar filmes filtrados (apenas país)

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <pais>Coreia do Sul</pais>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

## Listar filmes filtrados (apenas ano mínimo)

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <anoMinimo>2015</anoMinimo>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

## Listar filmes filtrados (apenas nota mínima)

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <reviewMinima>9.0</reviewMinima>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

## Listar filmes filtrados (apenas por id do usuário)

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <usuarioId>101</usuarioId>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

## Listar filmes filtrados (combinação de filtros)
### Coeria do Sul + ano mínimo 2018

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <pais>Coreia do Sul</pais>
      <anoMinimo>2018</anoMinimo>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

### Japão + nota mínima 8.5

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <pais>Japão</pais>
      <reviewMinima>8.5</reviewMinima>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

### Usuario 101 + ano mínimo 2010

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <listarFilmesFiltrados>
      <usuarioId>101</usuarioId>
      <anoMinimo>2010</anoMinimo>
    </listarFilmesFiltrados>
  </soap:Body>
</soap:Envelope>
```

## Estatísticas por país para usuário

```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <estatisticasPorPais>
            <usuarioId>101</usuarioId>
        </estatisticasPorPais>
    </soap:Body>
</soap:Envelope>
```