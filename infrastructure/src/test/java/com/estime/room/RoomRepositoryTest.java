package com.estime.room;

import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.TestApplication;
import java.time.Instant;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
@Transactional
class RoomRepositoryTest {

    @Autowired
    private RoomRepository roomRepository;

    @DisplayName("Room을 저장하면 createdAt이 자동으로 설정된다")
    @Test
    void save_setsCreatedAt() {
        // given
        final Instant beforeSave = Instant.now();
        final Room room = Room.withoutId(
                "테스트방",
                RoomSession.from("test-session"),
                LocalDateTime.now().plusDays(1)
        );

        // when
        final Room savedRoom = roomRepository.save(room);
        final Instant afterSave = Instant.now();

        // then
        assertSoftly(softly -> {
            softly.assertThat(savedRoom.getCreatedAt()).isNotNull();
            softly.assertThat(savedRoom.getCreatedAt())
                    .isAfterOrEqualTo(beforeSave)
                    .isBeforeOrEqualTo(afterSave);
        });
    }
}
