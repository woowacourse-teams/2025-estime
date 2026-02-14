package com.estime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableRetry
@ConfigurationPropertiesScan("com.estime.config")
public class EstimeApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EstimeApplication.class, args);
    }
}
