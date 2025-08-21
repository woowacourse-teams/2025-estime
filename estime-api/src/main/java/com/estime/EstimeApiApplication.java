package com.estime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EstimeApiApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EstimeApiApplication.class, args);
    }
}
