package com.estime.common.exception;

import com.estime.common.CustomApiResponse;
import com.estime.common.exception.application.ApplicationException;
import com.estime.common.exception.domain.DomainException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;

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

    @ExceptionHandler(AsyncRequestTimeoutException.class)
    public void handleAsyncRequestTimeoutException(final AsyncRequestTimeoutException e) {
        MDC.put("message", e.getMessage());
        log.debug("Async request timed out");
    }

    @ExceptionHandler(Exception.class)
    public CustomApiResponse<Void> handleException(final Exception e) {
        MDC.put("message", e.getMessage());
        log.error(e.getMessage());
        return CustomApiResponse.internalServerError("서버에서 예기치 못한 에러가 발생했습니다.");
    }
}
