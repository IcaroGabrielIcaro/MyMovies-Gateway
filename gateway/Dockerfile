# Build
FROM maven:3.8.4-openjdk-17-slim
WORKDIR /app

COPY pom.xml .
COPY mvnw ./
COPY .mvn ./.mvn

RUN chmod +x mvnw

COPY src ./src

ENV SPRING_PROFILES_ACTIVE=dev \
    TZ=America/Sao_Paulo

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]
