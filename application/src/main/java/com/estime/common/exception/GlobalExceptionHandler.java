package com.estime.common.exception;

import com.estime.common.CustomApiResponse;
import com.estime.shared.exception.DomainException;
import com.estime.exception.ApplicationException;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Set;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DomainException.class)
    public CustomApiResponse<Void> handleDomainException(final DomainException e) {
        log.warn(e.getLogMessage());
        return CustomApiResponse.badRequest(e.getUserMessage());
    }

    @ExceptionHandler(ApplicationException.class)
    public CustomApiResponse<Void> handleApplicationException(final ApplicationException e) {
        log.warn(e.getLogMessage());
        return CustomApiResponse.badRequest(e.getUserMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public CustomApiResponse<Void> handleMethodArgumentTypeMismatch(final MethodArgumentTypeMismatchException e) {
        log.warn(e.getMessage());
        return CustomApiResponse.badRequest("올바른 형식으로 다시 입력해 주세요.");
    }

    @ExceptionHandler(AsyncRequestTimeoutException.class)
    public void handleAsyncRequestTimeoutException(final AsyncRequestTimeoutException e) {
        MDC.put("message", e.getMessage());
        log.debug("Async request timed out");
    }

    @ExceptionHandler(IOException.class)
    public CustomApiResponse<Void> handleIOException(final IOException e, final HttpServletRequest request) {
        // SSE 관련 예외 패턴들 (대소문자 무시)
        final Set<Pattern> sseErrorPatterns = Set.of(
                Pattern.compile("broken pipe", Pattern.CASE_INSENSITIVE)
        );

        final String message = e.getMessage();
        if (message != null && sseErrorPatterns.stream().anyMatch(pattern ->
                pattern.matcher(message).find())) {
            log.debug("SSE client disconnected: {}", message);
            return null;
        }

        final String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("text/event-stream")) {
            return null;
        }

        return handleException(e);
    }

    @ExceptionHandler(Exception.class)
    public CustomApiResponse<Void> handleException(final Exception e) {
        MDC.put("message", e.getMessage());
        log.error(e.getMessage());
        return CustomApiResponse.internalServerError("서버에서 예기치 못한 에러가 발생했습니다.");
    }
}
