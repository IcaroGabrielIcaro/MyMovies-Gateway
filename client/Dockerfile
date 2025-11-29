FROM node:22-slim

WORKDIR /app

# Instala Angular CLI globalmente
RUN npm install -g @angular/cli@20

# Copia apenas package.json (melhor cache)
COPY package*.json ./

RUN npm install

# Copia o restante do projeto
COPY . .

EXPOSE 4200

ENV NODE_ENV=development \
    TZ=America/Sao_Paulo \
    CHOKIDAR_USEPOLLING=true

CMD ["ng", "serve", "--host", "0.0.0.0"]
