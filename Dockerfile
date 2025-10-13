# 빌드 단계 - 애플리케이션 컴파일 및 JAR 생성 (AWS Corretto JDK)
FROM amazoncorretto:21-alpine3.19-jdk AS build

WORKDIR /app

# Gradle 빌드 도구 및 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 소스 코드 복사 (core, application, infrastructure 모듈)
COPY core core
COPY application application
COPY infrastructure infrastructure

# Gradle 실행 권한 부여 및 애플리케이션 빌드
RUN chmod +x ./gradlew
RUN ./gradlew clean :application:bootJar --no-daemon

# 런타임 단계 - 실제 실행 환경 (AWS Corretto JRE, 경량화)
FROM amazoncorretto:21-alpine3.19

WORKDIR /app

# 한국 시간대 설정 및 헬스체크용 curl 설치 (root 권한으로)
RUN apk add --no-cache curl tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone && \
    apk del tzdata

# 빌드 단계에서 생성된 JAR 파일 복사
COPY --from=build /app/application/build/libs/application-*-SNAPSHOT.jar app.jar

# 보안을 위한 일반 사용자 생성 및 파일 소유권 변경
RUN addgroup -g 1001 -S appuser && adduser -S -u 1001 -G appuser appuser
RUN chown appuser:appuser app.jar

# 로그 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/logs && chown -R appuser:appuser /app/logs

USER appuser

# 애플리케이션 상태 확인 설정 (30초마다 체크)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
