package com.estime;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;

@SpringBootTest
class EnvironmentSanityCheckTest {

    @Autowired
    private Environment env;

    @Test
    void checkIfProfileAndDatasourceUrlIsSet() {
        assertThat(env.getActiveProfiles()).contains("local");
        System.out.println("DB URL = " + env.getProperty("spring.datasource.url"));
        System.out.println("DB USER = " + env.getProperty("spring.datasource.username"));
        System.out.println("DB PASSWORD = " + env.getProperty("spring.datasource.password"));
    }
}
