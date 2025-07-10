FROM eclipse-temurin:21-jdk-alpine

# Install bash, curl and download wait-for-it.sh
RUN apk add --no-cache bash curl \
  && curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
     -o /wait-for-it.sh \
  && chmod +x /wait-for-it.sh

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--timeout=30", "--strict", "--", "java", "-jar", "/app.jar"]
