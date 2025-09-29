package com.estime.room.domain.vo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.exception.NullNotAllowedException;
import com.estime.exception.SlotNotDivideException;
import com.estime.domain.room.timeslot.DateTimeSlot;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class DateTimeSlotTest {

    private LocalDateTime getValidDateTime() {
        return LocalDateTime.now().withSecond(0).withNano(0);
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 30})
    @DisplayName("정적 팩토리 메소드 from으로 DateTimeSlot을 생성한다.")
    void from(final int minute) {
        // given
        final LocalDateTime now = getValidDateTime().withMinute(minute);

        // when
        final DateTimeSlot dateTimeSlot = DateTimeSlot.from(now);

        // then
        assertThat(dateTimeSlot.getStartAt()).isEqualTo(now);
    }

    @DisplayName("from 메소드에 null을 전달하면 예외가 발생한다.")
    @Test
    void from_withNull() {
        // given
        final LocalDateTime nullDateTime = null;

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(nullDateTime))
                .isInstanceOf(NullNotAllowedException.class)
                .hasMessageContaining("cannot be null");
    }

    @DisplayName("30분 단위가 아닌 시간으로 DateTimeSlot을 생성하면 예외가 발생한다.")
    @Test
    void from_withInvalidMinute() {
        // given
        final LocalDateTime invalidDateTime = getValidDateTime().withMinute(15);

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(invalidDateTime))
                .isInstanceOf(SlotNotDivideException.class)
                .hasMessageContaining("must be an interval of 30 minutes");
    }

    @DisplayName("isBefore 메소드로 시간을 비교한다.")
    @Test
    void isBefore() {
        // given
        final DateTimeSlot now = DateTimeSlot.from(getValidDateTime().withMinute(0));
        final DateTimeSlot thirtyMinutesLater = DateTimeSlot.from(getValidDateTime().withMinute(30));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(now.isBefore(thirtyMinutesLater.getStartAt())).isTrue();
            softly.assertThat(thirtyMinutesLater.isBefore(now.getStartAt())).isFalse();
        });
    }

    @DisplayName("compareTo 메소드로 시간을 비교한다.")
    @Test
    void compareTo() {
        // given
        final DateTimeSlot now = DateTimeSlot.from(getValidDateTime().withMinute(0));
        final DateTimeSlot thirtyMinutesLater = DateTimeSlot.from(getValidDateTime().withMinute(30));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(now.compareTo(thirtyMinutesLater)).isNegative();
            softly.assertThat(thirtyMinutesLater.compareTo(now)).isPositive();
            softly.assertThat(now.compareTo(now)).isZero();
        });
    }
}
