package com.estime.room.domain.slot;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.Room;
import com.estime.room.slot.DateSlot;
import com.estime.shared.exception.NullNotAllowedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DateSlotTest {

    private Room room;

    @BeforeEach
    void setUp() {
        room = Room.withoutId("title", LocalDateTime.now().plusDays(1));
    }

    @DisplayName("정적 팩토리 메소드 of으로 DateSlot을 생성한다.")
    @Test
    void of() {
        // given
        final LocalDate now = LocalDate.now();

        // when
        final DateSlot dateSlot = DateSlot.of(room, now);

        // then
        assertThat(dateSlot.getStartAt()).isEqualTo(now);
    }

    @DisplayName("of 메소드에 null을 전달하면 예외가 발생한다.")
    @Test
    void of_withNull() {
        // given
        final LocalDate nullDate = null;

        // when & then
        assertThatThrownBy(() -> DateSlot.of(room, nullDate))
                .isInstanceOf(NullNotAllowedException.class)
                .hasMessageContaining("cannot be null");
    }

    @DisplayName("compareTo 메소드로 날짜를 비교한다.")
    @Test
    void compareTo() {
        // given
        final DateSlot today = DateSlot.of(room, LocalDate.now());
        final DateSlot tomorrow = DateSlot.of(room, LocalDate.now().plusDays(1));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(today.compareTo(tomorrow)).isNegative();
            softly.assertThat(tomorrow.compareTo(today)).isPositive();
            softly.assertThat(today.compareTo(today)).isZero();
        });
    }
}
