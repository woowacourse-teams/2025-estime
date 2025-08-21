package com.estime.common.logging;


import static com.estime.common.logging.MdcKey.CLIENT_IP;
import static com.estime.common.logging.MdcKey.HOST;
import static com.estime.common.logging.MdcKey.HTTP_METHOD;
import static com.estime.common.logging.MdcKey.QUERY_STRING;
import static com.estime.common.logging.MdcKey.REQUEST_URI;
import static com.estime.common.logging.MdcKey.TRACE_ID;
import static com.estime.common.logging.MdcKey.USER_AGENT;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ApiLogFilter implements Filter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    public void doFilter(final ServletRequest servletRequest, final ServletResponse servletResponse,
                         final FilterChain filterChain) throws IOException, ServletException {
        final HttpServletRequest request = (HttpServletRequest) servletRequest;
        final HttpServletResponse response = (HttpServletResponse) servletResponse;

        final String traceId = Optional.ofNullable(request.getHeader(REQUEST_ID_HEADER))
                .filter(s -> !s.isBlank())
                .orElseGet(this::generateTraceId);

        populateMDC(traceId, request);
        response.setHeader(REQUEST_ID_HEADER, traceId);

        final long startTime = System.currentTimeMillis();
        logRequest(request);

        int statusForLog = 200;
        try {
            filterChain.doFilter(servletRequest, servletResponse);
            statusForLog = response.getStatus();
        } catch (final Exception ex) {
            statusForLog = 500;
            throw ex;
        } finally {
            logResponse(response, startTime, statusForLog);
            MDC.clear();
        }
    }

    private void logRequest(final HttpServletRequest request) {
        final String uri = request.getRequestURI();
        final String method = request.getMethod();
        final String ip = request.getRemoteAddr();

        final String queryString = request.getQueryString();
        final String userAgentHeader = request.getHeader("User-Agent");
        final String query = (queryString != null ? "?" + queryString : "");
        final String userAgent = (userAgentHeader != null ? userAgentHeader : "-");

        log.info("[REQ] layer=filter | ip={} | method={} | uri={}{} | ua={}", ip, method, uri, query, userAgent);
    }

    private void logResponse(final HttpServletResponse response, final long startTime, final int status) {
        final long duration = System.currentTimeMillis() - startTime;
        final String contentType = Optional.ofNullable(response.getContentType()).orElse("-");

        log.info("[RES] layer=filter | status={} | duration={}ms | contentType={}", status, duration, contentType);
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
