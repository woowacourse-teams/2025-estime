package com.estime;

import com.estime.support.TestContainersConfig;
import com.estime.support.TestExecutorConfig;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@ConfigurationPropertiesScan("com.estime.config")
@Import({TestContainersConfig.class, TestExecutorConfig.class})
public class TestApplication {
}
