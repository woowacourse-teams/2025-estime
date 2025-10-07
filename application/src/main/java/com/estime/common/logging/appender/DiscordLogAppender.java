package com.estime.common.logging.appender;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.Layout;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import okhttp3.*;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Getter
@Setter
public class DiscordLogAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {

    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private static final int MAX_DISCORD_LENGTH = 2000;
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final long INITIAL_BACKOFF_MS = 1000;

    private final OkHttpClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final BlockingQueue<String> queue = new LinkedBlockingQueue<>(10000);
    private final AtomicBoolean running = new AtomicBoolean(false);

    private ExecutorService executor;
    private Future<?> workerTask;

    private String webhookUri;
    private Layout<ILoggingEvent> layout;
    private String username;
    private String avatarUrl;
    private boolean tts = false;

    public DiscordLogAppender() {
        // OkHttpClient 최적화: connection pool, timeout 설정
        this.client = new OkHttpClient.Builder()
                .connectTimeout(Duration.ofSeconds(10))
                .writeTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(10))
                .connectionPool(new ConnectionPool(5, 5, TimeUnit.MINUTES))
                .build();
    }

    @Override
    public void start() {
        if (webhookUri == null || webhookUri.isEmpty()) {
            addError("Discord webhook URI is not configured");
            return;
        }

        if (layout == null) {
            addError("Layout is not configured");
            return;
        }

        running.set(true);

        // Virtual Thread를 사용하는 ExecutorService 생성
        executor = Executors.newThreadPerTaskExecutor(
                Thread.ofVirtual()
                        .name("discord-appender-", 0)
                        .factory()
        );

        workerTask = executor.submit(this::processQueue);

        super.start();
    }

    @Override
    public void stop() {
        running.set(false);

        if (workerTask != null) {
            workerTask.cancel(true);
        }

        if (executor != null) {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        super.stop();
    }

    private void processQueue() {
        while (running.get() && !Thread.currentThread().isInterrupted()) {
            try {
                String text = queue.poll(1, TimeUnit.SECONDS);
                if (text != null) {
                    postWithRetry(text, 0);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    private void postWithRetry(String text, int attempt) {
        if (attempt >= MAX_RETRY_ATTEMPTS) {
            addError("Failed to post to Discord after " + MAX_RETRY_ATTEMPTS + " attempts");
            return;
        }

        try {
            PostResult result = post(text);

            if (result.shouldRetry) {
                long backoff = INITIAL_BACKOFF_MS * (1L << attempt); // exponential backoff
                Thread.sleep(Math.min(backoff, 30000)); // max 30초
                postWithRetry(text, attempt + 1);
            } else if (result.rateLimitSleep > 0) {
                Thread.sleep(result.rateLimitSleep);
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            addError("Unexpected error posting to Discord", e);

            // 재시도
            if (attempt < MAX_RETRY_ATTEMPTS - 1) {
                try {
                    Thread.sleep(INITIAL_BACKOFF_MS);
                    postWithRetry(text, attempt + 1);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    private PostResult post(String text) throws IOException {
        Map<String, Object> message = new HashMap<>();
        message.put("content", text);

        if (username != null) {
            message.put("username", username);
        }
        if (avatarUrl != null) {
            message.put("avatar_url", avatarUrl);
        }
        message.put("tts", tts);

        String json = objectMapper.writeValueAsString(message);
        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder()
                .url(webhookUri)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            int code = response.code();

            if (code >= 200 && code < 300) {
                // 성공
                return handleRateLimit(response, false);

            } else if (code == 429) {
                // Rate limit
                addWarn("Discord rate limit hit, will retry");

                // Rate limit 헤더에서 대기 시간 확인
                String retryAfter = response.header("Retry-After");
                long sleepMs = 1000;

                if (retryAfter != null) {
                    try {
                        sleepMs = Long.parseLong(retryAfter) * 1000;
                    } catch (NumberFormatException e) {
                        // 무시하고 기본값 사용
                    }
                }

                return new PostResult(true, sleepMs);

            } else if (code >= 500) {
                // 서버 에러 - 재시도
                addWarn("Discord server error: " + code);
                return new PostResult(true, INITIAL_BACKOFF_MS);

            } else {
                // 클라이언트 에러 - 재시도 노노
                String errorMsg = "Discord webhook error: " + code;
                if (response.body() != null) {
                    errorMsg += " - " + response.body().string();
                }
                addError(errorMsg);
                return new PostResult(false, 0);
            }
        }
    }

    private PostResult handleRateLimit(Response response, boolean shouldRetry) {
        String rateLimitRemaining = response.header("X-RateLimit-Remaining");
        String rateLimitReset = response.header("X-RateLimit-Reset");

        if (rateLimitRemaining != null && rateLimitReset != null) {
            try {
                int remaining = Integer.parseInt(rateLimitRemaining);

                if (remaining == 0) {
                    long resetTime = Long.parseLong(rateLimitReset) * 1000;
                    long sleepMs = resetTime - System.currentTimeMillis();

                    if (sleepMs > 0) {
                        return new PostResult(shouldRetry, sleepMs);
                    }
                }
            } catch (NumberFormatException e) {
                // 무시
            }
        }

        return new PostResult(shouldRetry, 0);
    }

    @Override
    protected void append(ILoggingEvent event) {
        if (!isStarted()) {
            return;
        }

        try {
            String text = layout.doLayout(event);

            if (text == null || text.trim().isEmpty()) {
                return;
            }

            // 빈 코드 블록 제거
            text = text.replaceAll("```\\s*```", "");

            // Discord 길이 제한 처리
            text = truncateToDiscordLimit(text);

            // 큐가 가득 차면 오래된 메시지 제거
            if (!queue.offer(text)) {
                queue.poll(); // 오래된 메시지 제거
                queue.offer(text); // 새 메시지 추가
                addWarn("Discord log queue full, dropping oldest message");
            }

        } catch (Exception e) {
            addError("Error formatting log event for Discord", e);
        }
    }

    private String truncateToDiscordLimit(String text) {
        if (text.length() <= MAX_DISCORD_LENGTH) {
            return text;
        }

        // 코드 블록 끝 보존
        boolean endsWithCodeBlock = text.endsWith("```");

        if (endsWithCodeBlock) {
            return text.substring(0, MAX_DISCORD_LENGTH - 3) + "```";
        } else {
            return text.substring(0, MAX_DISCORD_LENGTH);
        }
    }

    // 내부 결과 클래스
    private static class PostResult {
        final boolean shouldRetry;
        final long rateLimitSleep;

        PostResult(boolean shouldRetry, long rateLimitSleep) {
            this.shouldRetry = shouldRetry;
            this.rateLimitSleep = rateLimitSleep;
        }
    }
}
