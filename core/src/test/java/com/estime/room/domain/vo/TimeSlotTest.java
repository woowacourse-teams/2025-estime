package com.estime.room.domain.vo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.domain.room.timeslot.exception.InvalidTimeDetailException;
import com.estime.exception.NullNotAllowedException;
import com.estime.domain.room.timeslot.exception.SlotNotDivideException;
import com.estime.domain.room.timeslot.TimeSlot;
import java.time.LocalTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class TimeSlotTest {

    @ParameterizedTest
    @ValueSource(ints = {0, 30})
    @DisplayName("정적 팩토리 메소드 from으로 TimeSlot을 생성한다.")
    void from(final int minute) {
        // given
        final LocalTime time = LocalTime.of(10, minute);

        // when
        final TimeSlot timeSlot = TimeSlot.from(time);

        // then
        assertThat(timeSlot.getStartAt()).isEqualTo(time);
    }

    @DisplayName("from 메소드에 null을 전달하면 예외가 발생한다.")
    @Test
    void from_withNull() {
        // given
        final LocalTime nullTime = null;

        // when & then
        assertThatThrownBy(() -> TimeSlot.from(nullTime))
                .isInstanceOf(NullNotAllowedException.class)
                .hasMessageContaining("cannot be null");
    }

    @DisplayName("초 또는 나노초가 0이 아닌 시간으로 TimeSlot을 생성하면 예외가 발생한다.")
    @Test
    void from_withSeconds() {
        // given
        final LocalTime invalidTime = LocalTime.of(10, 0, 1);

        // when & then
        assertThatThrownBy(() -> TimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class)
                .hasMessageContaining("seconds and nanoseconds must be 0 for");
    }

    @DisplayName("30분 단위가 아닌 시간으로 TimeSlot을 생성하면 예외가 발생한다.")
    @Test
    void from_withInvalidMinute() {
        // given
        final LocalTime invalidTime = LocalTime.of(10, 15);

        // when & then
        assertThatThrownBy(() -> TimeSlot.from(invalidTime))
                .isInstanceOf(SlotNotDivideException.class)
                .hasMessageContaining("must be an interval of 30 minutes");
    }

    @DisplayName("compareTo 메소드로 시간을 비교한다.")
    @Test
    void compareTo() {
        // given
        final TimeSlot ten = TimeSlot.from(LocalTime.of(10, 0));
        final TimeSlot tenThirty = TimeSlot.from(LocalTime.of(10, 30));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(ten.compareTo(tenThirty)).isNegative();
            softly.assertThat(tenThirty.compareTo(ten)).isPositive();
            softly.assertThat(ten.compareTo(ten)).isZero();
        });
    }
}
