package com.estime.support;

import static org.mockito.BDDMockito.given;

import com.estime.TestApplication;
import com.estime.port.out.TimeProvider;
import com.estime.room.notification.PlatformNotificationService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

/**
 * 통합 테스트 베이스 클래스.
 * <p>
 * 공통 Mock Bean과 TimeProvider 기본 설정을 제공합니다.
 */
@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
@TestPropertySource(properties = "spring.main.allow-bean-definition-overriding=true")
@AutoConfigureMockMvc
public abstract class IntegrationTest {

    protected static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    protected static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.HOURS).plus(30, ChronoUnit.DAYS);
    protected static final LocalDateTime NOW_LOCAL_DATE_TIME = NOW.atZone(ZONE).toLocalDateTime();
    protected static final LocalDate NOW_LOCAL_DATE = NOW_LOCAL_DATE_TIME.toLocalDate();

    @MockitoBean
    protected PlatformNotificationService notificationService;

    @MockitoBean
    protected TimeProvider timeProvider;

    @BeforeEach
    void setUpIntegrationTest() {
        given(timeProvider.now()).willReturn(NOW);
        given(timeProvider.zone()).willReturn(ZONE);
        given(timeProvider.nowDateTime()).willReturn(NOW_LOCAL_DATE_TIME);
    }
}
