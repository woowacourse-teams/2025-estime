package com.estime.support;

import static org.mockito.BDDMockito.given;

import com.estime.TestApplication;
import com.estime.port.out.TimeProvider;
import com.estime.room.notification.PlatformNotificationService;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
@TestPropertySource(properties = "spring.main.allow-bean-definition-overriding=true")
@AutoConfigureMockMvc
public abstract class IntegrationTest {

    @MockitoBean
    protected PlatformNotificationService notificationService;

    @MockitoBean
    protected TimeProvider timeProvider;

    @BeforeEach
    void setUpIntegrationTest() {
        given(timeProvider.now()).willReturn(Instant.now().plus(30, ChronoUnit.DAYS));
        given(timeProvider.zone()).willReturn(ZoneId.of("Asia/Seoul"));
    }
}
