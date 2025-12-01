# Movie Gateway System — Microservices + REST + WebSocket + Docker

Este projeto implementa uma *arquitetura moderna de microserviços* com:

-   **API Gateway em Spring Boot**
-   **Serviço de Autenticação (Auth Service)**
-   **Serviço de Filmes em Django REST**
-   **Serviço de Notificações em WebSocket**
-   **Frontend em Angular**
-   Orquestração completa com **Docker Compose**
-   Comunicação REST + WebSocket
-   Autenticação via JWT

------------------------------------------------------------------------

## Arquitetura
                        +----------------------+
                        |       FRONTEND        |
                        |      Angular SPA      |
                        +-----------+-----------+
                                    |
                                    | HTTP (REST)
                                    v
                        +---------------------------+
                        |        GATEWAY API        |
                        |     Spring Boot (8080)    |
                        +--------+-----------+------+
                                 |           |
                Autenticação     |           |     Filmes
               (Login/Register)  |           |    (CRUD)
                                 v           v
                     +----------------+   +------------------------+
                     | AUTH-SERVICE   |   |   DJANGO REST SERVICE  |
                     | Spring Boot    |   |   Filmes / Likes       |
                     | (8081)         |   |   (8000)               |
                     +----------------+   +------------------------+

        +------------------------------------------------------+
        |        MICRO SERVIÇO DE NOTIFICAÇÕES (WebSocket)     |
        |                        (3003)                        |
        |   Comunicação direta com FRONT + integração Gateway  |
        +------------------------------------------------------+


------------------------------------------------------------------------

## Como Rodar

### Pré‑requisitos

-   Docker
-   Docker Compose

### Comando único para subir tudo

``` bash
docker compose up --build
```

Os serviços sobem automaticamente:

| Serviço  | Porta          |     Descrição |
|--------|------------------|--------------------------|
| Gateway API   | `8080` | API principal (orquestra tudo)|
| Auth Service   | `8081`    |  Login / Registro|
| Django REST filmes   | `8000`    |  CRUD de filmes, curtidas, etc|
| Notificações WebSocket   | `3003`    |  Notificações em tempo real|
| Frontend Angular   | `4200`    |  Interface do usuário|

------------------------------------------------------------------------

## Endpoints Principais

### **Auth via Gateway**

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
| POST      | `/movies/{id}/like` | Curtir um filme |
| DELETE      | `/movies/{id}/like` | Remover curtida de um filme |

------------------------------------------------------------------------

## Documentação Swagger

Assim que o gateway estiver rodando:

**http://localhost:8080/swagger-ui.html**
<br>ou<br>
**http://localhost:8080/swagger-ui/index.html**

Aqui você encontra: - Descrição de cada endpoint\
- Explicações de cada campo\
- Códigos de retorno\
- Exemplos de requisições e respostas

------------------------------------------------------------------------

## Estrutura do Projeto

    /
    ├── authentication/     # Auth Service (Spring Boot)
    ├── gateway/            # API Gateway (Spring Boot)
    ├── movies/             # Django Rest Service (filmes)
    ├── notifications/     # Microserviço WebSocket
    ├── client/             # Angular SPA
    └── docker-compose.yml

------------------------------------------------------------------------

## Testando Manualmente

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

------------------------------------------------------------------------

### Link Apresentação

**[Canva](https://www.canva.com/design/DAG6QWIUEmc/z64MLHt-g0BJKU35cMdzWA/edit?utm_content=DAG6QWIUEmc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)**
