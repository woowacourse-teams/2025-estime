package com.estime.support;

import java.util.concurrent.Executor;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestExecutorConfig {

    @Bean
    @Primary
    public Executor outboxCallbackExecutor() {
        return Runnable::run;
    }
}
