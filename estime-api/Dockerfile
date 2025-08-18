FROM eclipse-temurin:21-jdk-alpine

RUN apk add --no-cache curl
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
