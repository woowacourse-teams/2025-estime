FROM eclipse-temurin:21-jdk-alpine

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} /app.jar

ENTRYPOINT ["/usr/bin/env", "java", "-jar", "/app.jar"]
