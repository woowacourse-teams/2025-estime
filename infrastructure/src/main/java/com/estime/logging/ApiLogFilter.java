package com.estime.logging;

import static com.estime.logging.MdcKey.CLIENT_IP;
import static com.estime.logging.MdcKey.HOST;
import static com.estime.logging.MdcKey.HTTP_METHOD;
import static com.estime.logging.MdcKey.QUERY_STRING;
import static com.estime.logging.MdcKey.REQUEST_URI;
import static com.estime.logging.MdcKey.TRACE_ID;
import static com.estime.logging.MdcKey.USER_AGENT;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.slf4j.event.Level;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;

@Slf4j(topic = "API_LOG")
@Component
public class ApiLogFilter implements Filter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String API_PREFIX = "/api";

    @Override
    public void doFilter(final ServletRequest servletRequest, final ServletResponse servletResponse,
                         final FilterChain filterChain) throws IOException, ServletException {
        final HttpServletRequest request = (HttpServletRequest) servletRequest;
        final HttpServletResponse response = (HttpServletResponse) servletResponse;
        final ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);

        final String traceId = Optional.ofNullable(request.getHeader(REQUEST_ID_HEADER))
                .filter(s -> !s.isBlank())
                .orElseGet(this::generateTraceId);

        populateMDC(traceId, request);
        response.setHeader(REQUEST_ID_HEADER, traceId);

        final long startTime = System.currentTimeMillis();

        int statusForLog = -1;
        try {
            filterChain.doFilter(wrappedRequest, servletResponse);
            statusForLog = response.getStatus();
        } catch (final Exception ex) {
            statusForLog = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            throw ex;
        } finally {
            final long duration = System.currentTimeMillis() - startTime;
            final Level logLevel = resolveLogLevel(request.getRequestURI(), statusForLog);
            logApi(request, statusForLog, duration, logLevel);
            logRequestBody(wrappedRequest, logLevel);
            MDC.clear();
        }
    }

    private Level resolveLogLevel(final String uri, final int status) {
        if (status >= 500) {
            return Level.ERROR;
        }
        if (status >= 400) {
            return Level.WARN;
        }
        if (uri.startsWith(API_PREFIX)) {
            return Level.INFO;
        }
        return Level.DEBUG;
    }

    private void logApi(final HttpServletRequest request, final int status, final long duration, final Level level) {
        final String uri = request.getRequestURI();
        final String method = request.getMethod();
        final String ip = request.getRemoteAddr();
        final String queryString = request.getQueryString();
        final String query = (queryString != null ? "?" + queryString : "");

        log.atLevel(level)
                .log("{} | {} {}{} | {} | {}ms", ip, method, uri, query, formatStatus(status), duration);
    }

    private void logRequestBody(final ContentCachingRequestWrapper request, final Level level) {
        final String contentType = request.getContentType();
        if (contentType == null) {
            return;
        }

        if (contentType.contains("application/json")) {
            log.atLevel(level)
                    .log("[REQ-BODY] {}", new String(request.getContentAsByteArray(), StandardCharsets.UTF_8));
            return;
        }

        log.atLevel(level).log("[REQ-BODY] content-type={}", contentType);
    }

    private String formatStatus(final int statusCode) {
        try {
            return statusCode + " " + HttpStatus.valueOf(statusCode).getReasonPhrase();
        } catch (final IllegalArgumentException e) {
            return statusCode + " Unknown";
        }
    }

    private String generateTraceId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private void populateMDC(final String traceId, final HttpServletRequest request) {
        MDC.put(TRACE_ID.getKey(), traceId);
        MDC.put(HOST.getKey(), request.getHeader("host"));
        MDC.put(HTTP_METHOD.getKey(), request.getMethod());
        MDC.put(REQUEST_URI.getKey(), request.getRequestURI());
        MDC.put(QUERY_STRING.getKey(), request.getQueryString());
        MDC.put(CLIENT_IP.getKey(), request.getRemoteAddr());
        MDC.put(USER_AGENT.getKey(), request.getHeader("User-Agent"));
    }
}
