package com.estime.room.domain.slot;

import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.slot.DateSlot;
import com.estime.shared.exception.NullNotAllowedException;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DateSlotTest {

    @DisplayName("정적 팩토리 메소드 of으로 DateSlot을 생성한다.")
    @Test
    void of() {
        // given
        final LocalDate now = LocalDate.now();

        // when
        final DateSlot dateSlot = DateSlot.of(1L, now);

        // then
        assertSoftly(softly -> {
            softly.assertThat(dateSlot.getRoomId()).isEqualTo(1L);
            softly.assertThat(dateSlot.getStartAt()).isEqualTo(now);
        });
    }

    @DisplayName("of 메소드에 null을 전달하면 예외가 발생한다.")
    @Test
    void of_withNull() {
        // given
        final LocalDate nullDate = null;
        final Long nullRoomId = null;

        // when & then
        assertSoftly(softly -> {
            softly.assertThatThrownBy(() -> DateSlot.of(1L, nullDate))
                    .isInstanceOf(NullNotAllowedException.class)
                    .hasMessageContaining("cannot be null");
            softly.assertThatThrownBy(() -> DateSlot.of(nullRoomId, LocalDate.now()))
                    .isInstanceOf(NullNotAllowedException.class)
                    .hasMessageContaining("cannot be null");
        });
    }

    @DisplayName("compareTo 메소드로 날짜를 비교한다.")
    @Test
    void compareTo() {
        // given
        final DateSlot today = DateSlot.of(1L, LocalDate.now());
        final DateSlot tomorrow = DateSlot.of(1L, LocalDate.now().plusDays(1));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(today.compareTo(tomorrow)).isNegative();
            softly.assertThat(tomorrow.compareTo(today)).isPositive();
            softly.assertThat(today.compareTo(today)).isZero();
        });
    }
}
