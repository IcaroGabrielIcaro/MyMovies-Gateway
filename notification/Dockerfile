FROM node:20

WORKDIR /app

COPY package*.json ./

# instala dependências E garante sqlite3
RUN npm install sqlite3 --save && npm install

COPY . .

EXPOSE 3003

CMD ["npm", "run", "start"]
