package com.estime.logging;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Slf4j
public class ControllerLoggingAspect {

    private static final int MAX_LOG_LENGTH = 500;

    @Pointcut("execution(* com.estime.sse.controller..*(..)) || execution(* com.estime.room.controller..*(..))")
    public void controllerMethods() {
    }

    @Around("controllerMethods()")
    public Object logController(final ProceedingJoinPoint joinPoint) throws Throwable {
        final MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        final String className = signature.getDeclaringType().getSimpleName();
        final String methodName = signature.getName();
        final Object[] args = joinPoint.getArgs();

        final HttpServletRequest request = getCurrentHttpRequest();
        final String httpMethod = request != null ? request.getMethod() : "N/A";
        final String uri = request != null ? request.getRequestURI() : "N/A";

        final long startTime = System.currentTimeMillis();
        logRequest(className, methodName, httpMethod, uri, args);

        final Object result = joinPoint.proceed();
        logResponse(className, methodName, httpMethod, uri, result, startTime);

        return result;
    }

    private void logRequest(
            final String className, final String methodName,
            final String httpMethod, final String uri, final Object[] args
    ) {
        log.info("[REQ] layer=controller | method={}.{} | httpMethod={} | uri={} | args={}",
                className, methodName, httpMethod, uri, Arrays.toString(args));
    }

    private void logResponse(
            final String className, final String methodName,
            final String httpMethod, final String uri, final Object result, final long startTime
    ) {
        final long duration = System.currentTimeMillis() - startTime;
        final String resultStr = formatResult(result);

        log.info("[RES] layer=controller | method={}.{} | httpMethod={} | uri={} | duration={}ms | result={}",
                className, methodName, httpMethod, uri, duration, resultStr);
    }

    private HttpServletRequest getCurrentHttpRequest() {
        return Optional.ofNullable(RequestContextHolder.getRequestAttributes())
                .filter(ServletRequestAttributes.class::isInstance)
                .map(ServletRequestAttributes.class::cast)
                .map(ServletRequestAttributes::getRequest)
                .orElse(null);
    }

    private String formatResult(final Object result) {
        if (result == null) {
            return "null";
        }
        final String resultStr = result.toString();
        return resultStr.length() <= MAX_LOG_LENGTH ? resultStr : resultStr.substring(0, MAX_LOG_LENGTH) + "...";
    }
}
