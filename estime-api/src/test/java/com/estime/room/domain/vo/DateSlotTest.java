package com.estime.room.domain.vo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.domain.slot.vo.DateSlot;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DateSlotTest {

    @Test
    @DisplayName("정적 팩토리 메소드 from으로 DateSlot을 생성한다.")
    void from() {
        // given
        final LocalDate now = LocalDate.now();

        // when
        final DateSlot dateSlot = DateSlot.from(now);

        // then
        assertThat(dateSlot.getStartAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("from 메소드에 null을 전달하면 예외가 발생한다.")
    void from_withNull() {
        // given
        final LocalDate nullDate = null;

        // when & then
        assertThatThrownBy(() -> DateSlot.from(nullDate))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("startAt cannot be null");
    }

    @Test
    @DisplayName("과거 날짜로 DateSlot을 생성하면 예외가 발생한다.")
    void from_withPastDate() {
        // given
        final LocalDate pastDate = LocalDate.now().minusDays(1);

        // when & then
        assertThatThrownBy(() -> DateSlot.from(pastDate))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("dateSlot cannot be past date: " + pastDate);
    }

    @Test
    @DisplayName("compareTo 메소드로 날짜를 비교한다.")
    void compareTo() {
        // given
        final DateSlot today = DateSlot.from(LocalDate.now());
        final DateSlot tomorrow = DateSlot.from(LocalDate.now().plusDays(1));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(today.compareTo(tomorrow)).isNegative();
            softly.assertThat(tomorrow.compareTo(today)).isPositive();
            softly.assertThat(today.compareTo(today)).isZero();
        });
    }
}
