package com.estime.logging;

import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ServiceLoggingAspect {

    private static final int MAX_LOG_LENGTH = 500;

    @Pointcut("execution(* com.estime..service..*(..))")
    public void serviceMethods() {
    }

    @Around("serviceMethods()")
    public Object logService(final ProceedingJoinPoint joinPoint) throws Throwable {
        final MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        final String className = signature.getDeclaringType().getSimpleName();
        final String methodName = signature.getName();
        final Object[] args = joinPoint.getArgs();

        final long startTime = System.currentTimeMillis();
        logRequest(className, methodName, args);

        final Object result = joinPoint.proceed();
        logResponse(className, methodName, result, startTime);

        return result;
    }

    private void logRequest(final String className, final String methodName, final Object[] args) {
        log.info("[REQ] layer=service | method={}.{} | args={}", className, methodName, Arrays.toString(args));
    }

    private void logResponse(
            final String className, final String methodName, final Object result, final long startTime
    ) {
        final long duration = System.currentTimeMillis() - startTime;
        final String resultStr = formatResult(result);

        log.info("[RES] layer=service | method={}.{} | duration={}ms | result={}", className, methodName, duration,
                resultStr);
    }

    private String formatResult(final Object result) {
        if (result == null) {
            return "null";
        }
        final String resultStr = result.toString();
        return resultStr.length() <= MAX_LOG_LENGTH ? resultStr : resultStr.substring(0, MAX_LOG_LENGTH) + "...";
    }
}
