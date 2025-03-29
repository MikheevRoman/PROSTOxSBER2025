FROM maven:3.8-openjdk-17 AS builder
LABEL authors="ded_mikhey"

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
LABEL authors="ded_mikhey"

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV POSTGRES_DB_URL=jdbc:postgresql://postgres:5431/company-event \
    POSTGRES_DB_USER=postgres \
    POSTGRES_DB_PASSWORD=root \
    SHOW_SQL=true \
    TELEGRAM_BOT_API_ADDRESS=http://company-events-telegram-bot:8081

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]