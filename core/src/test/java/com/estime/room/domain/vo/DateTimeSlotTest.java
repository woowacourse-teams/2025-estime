package com.estime.room.domain.vo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.slot.DateTimeSlot;
import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.exception.NullNotAllowedException;
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
            softly.assertThat(now.getStartAt().isBefore(thirtyMinutesLater.getStartAt())).isTrue();
            softly.assertThat(thirtyMinutesLater.getStartAt().isBefore(now.getStartAt())).isFalse();
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

    @DisplayName("초가 0이 아닌 시간으로 생성 시 예외 발생")
    @Test
    void from_withNonZeroSecond() {
        // given: 14:00:30
        final LocalDateTime invalidTime = LocalDateTime.of(2025, 10, 24, 14, 0, 30);

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class);
    }

    @DisplayName("나노초가 0이 아닌 시간으로 생성 시 예외 발생")
    @Test
    void from_withNonZeroNano() {
        // given: 14:00:00.000000001
        final LocalDateTime invalidTime = LocalDateTime.of(2025, 10, 24, 14, 0, 0, 1);

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class);
    }

    @DisplayName("equals와 hashCode 검증")
    @Test
    void testEquals() {
        // given
        final LocalDateTime time = LocalDateTime.of(2025, 10, 24, 14, 0);
        final DateTimeSlot slot1 = DateTimeSlot.from(time);
        final DateTimeSlot slot2 = DateTimeSlot.from(time);

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(slot1).isEqualTo(slot2);
            softly.assertThat(slot1).hasSameHashCodeAs(slot2);
        });
    }

    @DisplayName("toString 검증")
    @Test
    void testToString() {
        // given
        final LocalDateTime time = LocalDateTime.of(2025, 10, 24, 14, 30);
        final DateTimeSlot slot = DateTimeSlot.from(time);

        // when
        final String result = slot.toString();

        // then
        assertThat(result).contains("2025-10-24T14:30");
    }

    @DisplayName("23:30 (하루의 마지막 30분 슬롯)으로 생성 성공")
    @Test
    void from_lastSlotOfDay() {
        // given: 23:30
        final LocalDateTime lastSlot = LocalDateTime.of(2025, 10, 24, 23, 30);

        // when
        final DateTimeSlot slot = DateTimeSlot.from(lastSlot);

        // then
        assertThat(slot.getStartAt()).isEqualTo(lastSlot);
    }

    @DisplayName("00:00 (하루의 첫 슬롯)으로 생성 성공")
    @Test
    void from_firstSlotOfDay() {
        // given: 00:00
        final LocalDateTime firstSlot = LocalDateTime.of(2025, 10, 24, 0, 0);

        // when
        final DateTimeSlot slot = DateTimeSlot.from(firstSlot);

        // then
        assertThat(slot.getStartAt()).isEqualTo(firstSlot);
    }
}
