# 🎬 Movie Gateway System -- Microservices + SOAP + REST + Docker

Este projeto implementa um **gateway REST** em Spring Boot que integra:

-   ✔️ Um **serviço de autenticação** (Auth Service)
-   ✔️ Um **serviço SOAP** escrito em Python/Flask (Movies SOAP Service)
-   ✔️ Um **API Gateway** com HATEOAS e documentação Swagger
-   ✔️ Um **cliente web** simples em HTML/JS
-   ✔️ Toda a arquitetura orquestrada com **Docker Compose**

------------------------------------------------------------------------

## 📌 Arquitetura

                       +----------------------+
                       |        CLIENTE       |
                       |  (HTML + JS / SPA)   |
                       +----------+-----------+
                                  |
                                  | HTTP Requests
                                  v
                       +----------------------+
                       |     GATEWAY API      |
                       |  Spring Boot (8080)  |
                       +----+------------+----+
                            |            |
                            |            |
     Autenticação           |            |     Operações SOAP
    (Login / Register)      |            |       Filmes
                            v            v
                 +----------------+    +----------------+
                 | AUTH-SERVICE   |    |  SOAP-SERVICE  |
                 | Spring Boot    |    | Flask + WSDL   |
                 | (8081)         |    | (5000)         |
                 +----------------+    +----------------+

------------------------------------------------------------------------

## 🚀 Como Rodar

### ✔️ Pré‑requisitos

-   Docker
-   Docker Compose

### ✔️ Comando único para subir tudo

``` bash
docker compose up --build
```

Os serviços sobem automaticamente:

  Serviço        Porta      Descrição
  -------------- ---------- ------------------------
  Gateway        **8080**   API REST principal
  Auth Service   **8081**   Registro/Login
  SOAP Service   **5000**   Serviço SOAP de filmes

------------------------------------------------------------------------

## 🌐 Endpoints Principais

### 🔐 **Auth via Gateway**

| Método  | Rota          |     Descrição |
|--------|------------------|--------------------------|
| POST   | `/auth/register` | Cadastrar usuário|
| POST   | `/auth/login`    |  Login, retorna token JWT|

### 🎞 **Filmes**

| Método   | Rota                   | Descrição             |
| -------- |------------------------|-----------------------|
| POST     | `/movies`              | Inserir filme         |
| PUT      | `/movies/{id}`         | Atualizar             |
| DELETE   | `/movies/{id}`         | Excluir               |
| GET      | `/movies/{id}`         | Buscar por id         |
| GET      | `/movies`              | Listar com filtros    |
| GET      | `/movies/estatisticas` | Estatísticas por país |

### 📄 **WSDL**

| Método  | Rota     | Descrição |
|--------|---------|--------------------------------|
| GET    |  `/wsdl` |  Retorna o WSDL do serviço SOAP |

------------------------------------------------------------------------

## 📘 Documentação Swagger

Assim que o gateway estiver rodando:

👉 **http://localhost:8080/swagger-ui.html**\
ou\
👉 **http://localhost:8080/swagger-ui/index.html**

Aqui você encontra: - Descrição de cada endpoint\
- Explicações de cada campo\
- Códigos de retorno\
- Exemplos de requisições e respostas

------------------------------------------------------------------------

## 📁 Estrutura do Projeto

    /
    ├── authentication/     # Auth Service
    ├── gateway/            # API Gateway
    ├── movies/             # SOAP Service
    ├── client/             # HTML/JS client
    └── docker-compose.yml

------------------------------------------------------------------------

## 🧪 Testando Manualmente

### Login

``` bash
POST http://localhost:8080/auth/login
{
  "username": "admin",
  "password": "123"
}
```

### Listar Filmes

``` bash
GET http://localhost:8080/movies
Authorization: Bearer <token>
```


