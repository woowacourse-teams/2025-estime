package com.estime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EstimeApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EstimeApplication.class, args);
    }
}
