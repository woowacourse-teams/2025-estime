package com.estime.logging;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class SchedulerLoggingAspect {

    private static final String SCHEDULER_PREFIX = "SCH-";

    @Pointcut("@annotation(org.springframework.scheduling.annotation.Scheduled)")
    public void scheduledMethods() {
    }

    @Around("scheduledMethods()")
    public Object setMdcForScheduler(final ProceedingJoinPoint joinPoint) throws Throwable {
        if (MDC.get(MdcKey.TRACE_ID.getKey()) != null) {
            return joinPoint.proceed();
        }

        final String traceId = SCHEDULER_PREFIX + generateShortId();
        final String methodName = joinPoint.getSignature().toShortString();
        MDC.put(MdcKey.TRACE_ID.getKey(), traceId);

        final long startTime = System.currentTimeMillis();
        log.info("[START] scheduler={}", methodName);
        try {
            return joinPoint.proceed();
        } finally {
            final long duration = System.currentTimeMillis() - startTime;
            log.info("[END] scheduler={} | duration={}ms", methodName, duration);
            MDC.clear();
        }
    }

    private String generateShortId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}