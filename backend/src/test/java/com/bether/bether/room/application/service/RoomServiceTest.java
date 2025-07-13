package com.bether.bether.room.application.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.bether.bether.room.application.dto.RoomInput;
import com.bether.bether.room.application.dto.RoomOutput;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class RoomServiceTest {

    @Autowired
    private RoomService roomService;

    @DisplayName("방을 생성할 수 있다.")
    @Test
    void save() {
        // given
        final RoomInput input = new RoomInput("title", List.of(LocalDate.now()), LocalTime.MIN, LocalTime.MAX);

        // when
        final RoomOutput saved = roomService.save(input);

        // then
        assertThat(isValidUUID(saved.session().toString()))
                .isTrue();
    }

    private boolean isValidUUID(String uuid) {
        if (uuid == null || uuid.isEmpty()) {
            return false;
        }
        try {
            UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
