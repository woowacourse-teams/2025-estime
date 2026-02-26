# 이 Dockerfile은 사전 빌드된 JAR를 런타임 이미지에 패키징합니다.
# JAR 빌드는 Dockerfile 외부에서 수행되어야 합니다. (예: ./gradlew :api:bootJar)

FROM amazoncorretto:21-alpine3.19

WORKDIR /app

# 한국 시간대 설정 및 헬스체크용 curl 설치 (root 권한으로)
RUN apk add --no-cache curl tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone && \
    apk del tzdata

# 사전 빌드된 JAR 파일 복사
COPY api/build/libs/api-*-SNAPSHOT.jar app.jar

# 보안을 위한 일반 사용자 생성 및 파일 소유권 변경
RUN addgroup -g 1001 -S appuser && adduser -S -u 1001 -G appuser appuser
RUN chown appuser:appuser app.jar

USER appuser

# 애플리케이션 상태 확인 설정 (30초마다 체크)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
