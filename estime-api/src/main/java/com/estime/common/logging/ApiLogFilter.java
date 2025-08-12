package com.estime.common.logging;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ApiLogFilter implements Filter {

    private static final String TRACE_ID_KEY = "traceId";

    @Override
    public void doFilter(final ServletRequest servletRequest, final ServletResponse servletResponse,
                         final FilterChain filterChain) throws IOException, ServletException {
        final HttpServletRequest request = (HttpServletRequest) servletRequest;
        final HttpServletResponse response = (HttpServletResponse) servletResponse;

        final String traceId = generateTraceId();
        MDC.put(TRACE_ID_KEY, traceId);
        MDC.put("host", request.getHeader("host"));
        MDC.put("httpMethod", request.getMethod());
        MDC.put("requestUri", request.getRequestURI());
        MDC.put("queryString", request.getQueryString());
        MDC.put("clientIp", request.getRemoteAddr());
        MDC.put("userAgent", request.getHeader("User-Agent"));

        final long startTime = System.currentTimeMillis();
        logRequest(request);

        try {
            filterChain.doFilter(servletRequest, servletResponse);
            logResponse(response, startTime);
        } catch (final Exception ex) {
            logError(request, ex, startTime);
            throw ex;
        } finally {
            MDC.clear();
        }
    }

    private void logRequest(final HttpServletRequest request) {
        final String uri = request.getRequestURI();
        final String method = request.getMethod();
        final String ip = request.getRemoteAddr();
        final String query = request.getQueryString();
        final String userAgent = request.getHeader("User-Agent");

        log.info("[REQ] layer=filter | ip={} | method={} | uri={}{} | ua={}",
                ip, method, uri,
                (query != null ? "?" + query : ""),
                (userAgent != null ? userAgent : "-")
        );
    }

    private void logResponse(final HttpServletResponse response, final long startTime) {
        final long duration = System.currentTimeMillis() - startTime;
        final int status = response.getStatus();
        final String contentType = response.getContentType();
        final int contentLength = response.getBufferSize();

        log.info("[RES] layer=filter | status={} | duration={}ms | contentType={} | length={}",
                status, duration,
                (contentType != null ? contentType : "-"),
                (contentLength > 0 ? contentLength + "B" : "-")
        );
    }

    private void logError(final HttpServletRequest request, final Exception ex, final long startTime) {
        final long duration = System.currentTimeMillis() - startTime;
        final String uri = request.getRequestURI();
        final String method = request.getMethod();
        final int status = 500;

        log.error("[ERR] layer=filter | method={} | uri={} | duration={}ms | status={} | error={}",
                method, uri, duration, status, ex.toString(), ex);
    }

    private String generateTraceId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
