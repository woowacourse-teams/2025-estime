FROM eclipse-temurin:21-jdk-alpine

RUN apk add --no-cache bash curl dos2unix \
  && curl -fsSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
     -o /usr/local/bin/wait-for-it \
  && dos2unix /usr/local/bin/wait-for-it \
  && chmod +x /usr/local/bin/wait-for-it

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} /app.jar

ENTRYPOINT ["/usr/bin/env", "bash", "/usr/local/bin/wait-for-it", "mysql:3306", "--timeout=30", "--strict", "--", "java", "-jar", "/app.jar"]
