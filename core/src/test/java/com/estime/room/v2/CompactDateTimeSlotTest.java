package com.estime.room.v2;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.room.slot.exception.CompactDateTimeSlotOutOfRangeException;
import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.exception.NullNotAllowedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("CompactDateTimeSlot 테스트")
class CompactDateTimeSlotTest {

    @Test
    @DisplayName("압축된 슬롯 코드로부터 생성")
    void createFromEncodedValue() {
        // given
        final int encoded = 28; // 0x0001C

        // when
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(encoded);

        // then
        assertThat(slot.getEncoded()).isEqualTo(28);
    }

    @Test
    @DisplayName("슬롯 비교 - 작은 값이 먼저")
    void compareSlots() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(28);    // 2025-10-24 14:00
        final CompactDateTimeSlot slot2 = CompactDateTimeSlot.from(3603);  // 2025-11-07 09:30

        // when & then
        assertSoftly(softly -> {
            assertThat(slot1.compareTo(slot2)).isLessThan(0);
            assertThat(slot2.compareTo(slot1)).isGreaterThan(0);
        });
    }

    @Test
    @DisplayName("동일 슬롯 equals 검증")
    void testEquals() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(28);
        final CompactDateTimeSlot slot2 = CompactDateTimeSlot.from(28);

        // when & then
        assertSoftly(softly -> {
            assertThat(slot1).isEqualTo(slot2);
            assertThat(slot1).hasSameHashCodeAs(slot2);
        });
    }

    @Test
    @DisplayName("toString 검증 - 사람이 읽을 수 있는 형식")
    void testToString() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(28);     // 2025-10-24 14:00
        final CompactDateTimeSlot slot2 = CompactDateTimeSlot.from(3603);   // 2025-11-07 09:30

        // when
        final String result1 = slot1.toString();
        final String result2 = slot2.toString();

        // then
        assertSoftly(softly -> {
            assertThat(result1).isEqualTo("2025-10-24 14:00 (28)");
            assertThat(result2).isEqualTo("2025-11-07 09:30 (3603)");
        });
    }

    @Test
    @DisplayName("from(int) - 음수 값으로 생성 시 예외 발생")
    void createFromNegativeValue() {
        // when & then
        assertThatThrownBy(() -> CompactDateTimeSlot.from(-1))
                .isInstanceOf(CompactDateTimeSlotOutOfRangeException.class);
    }

    @Test
    @DisplayName("from(int) - 최대값 초과 시 예외 발생")
    void createFromValueExceedingMax() {
        // given: 0xFFFFF = 1048575 초과
        final int exceedingValue = 0xFFFFF + 1;

        // when & then
        assertThatThrownBy(() -> CompactDateTimeSlot.from(exceedingValue))
                .isInstanceOf(CompactDateTimeSlotOutOfRangeException.class);
    }

    @Test
    @DisplayName("from(int) - 경계값 0으로 생성 성공")
    void createFromMinValue() {
        // given
        final int minValue = 0;

        // when
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(minValue);

        // then
        assertThat(slot.getEncoded()).isEqualTo(0);
        assertThat(slot.getStartAtLocalDate()).isEqualTo(LocalDate.of(2025, 10, 24)); // EPOCH
        assertThat(slot.getStartAtLocalTime()).isEqualTo(LocalTime.of(0, 0));
    }

    @Test
    @DisplayName("from(int) - 경계값 최대값(0xFFFFF)으로 생성 성공")
    void createFromMaxValue() {
        // given
        final int maxValue = 0xFFFFF; // 1048575

        // when
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(maxValue);

        // then
        assertThat(slot.getEncoded()).isEqualTo(maxValue);
    }

    @Test
    @DisplayName("from(LocalDateTime) - null 값으로 생성 시 예외 발생")
    void createFromNullDateTime() {
        // when & then
        assertThatThrownBy(() -> CompactDateTimeSlot.from(null))
                .isInstanceOf(NullNotAllowedException.class);
    }

    @Test
    @DisplayName("from(LocalDateTime) - 30분 단위가 아닌 시간으로 생성 시 예외 발생")
    void createFromInvalidMinute() {
        // given: 14:15 (30분 단위 아님)
        final LocalDateTime invalidTime = LocalDateTime.of(2025, 10, 24, 14, 15);

        // when & then
        assertThatThrownBy(() -> CompactDateTimeSlot.from(invalidTime))
                .isInstanceOf(SlotNotDivideException.class);
    }

    @Test
    @DisplayName("from(LocalDateTime) - 초가 0이 아닌 시간으로 생성 시 예외 발생")
    void createFromNonZeroSecond() {
        // given: 14:00:30 (초가 0이 아님)
        final LocalDateTime invalidTime = LocalDateTime.of(2025, 10, 24, 14, 0, 30);

        // when & then
        assertThatThrownBy(() -> CompactDateTimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class);
    }

    @Test
    @DisplayName("from(LocalDateTime) - 나노초가 0이 아닌 시간으로 생성 시 예외 발생")
    void createFromNonZeroNano() {
        // given: 14:00:00.000000001 (나노초가 0이 아님)
        final LocalDateTime invalidTime = LocalDateTime.of(2025, 10, 24, 14, 0, 0, 1);

        // when & then
        assertThatThrownBy(() -> CompactDateTimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class);
    }

    @Test
    @DisplayName("from(LocalDateTime) - EPOCH 시작 시간(2025-10-24 00:00)으로 생성 성공")
    void createFromEpochStart() {
        // given: EPOCH의 시작 시간
        final LocalDateTime epochStart = LocalDateTime.of(2025, 10, 24, 0, 0);

        // when
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(epochStart);

        // then
        assertThat(slot.getEncoded()).isEqualTo(0);
        assertThat(slot.getStartAtLocalDate()).isEqualTo(LocalDate.of(2025, 10, 24));
        assertThat(slot.getStartAtLocalTime()).isEqualTo(LocalTime.of(0, 0));
    }

    @Test
    @DisplayName("from(LocalDateTime) - 23:30 (하루의 마지막 슬롯)으로 생성 성공")
    void createFromLastSlotOfDay() {
        // given: 23:30 (하루의 마지막 30분 슬롯)
        final LocalDateTime lastSlot = LocalDateTime.of(2025, 10, 24, 23, 30);

        // when
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(lastSlot);

        // then
        assertThat(slot.getStartAtLocalTime()).isEqualTo(LocalTime.of(23, 30));
    }

    @Test
    @DisplayName("getStartAtLocalDate() - 날짜 부분 추출 검증")
    void getStartAtLocalDate() {
        // given
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(3603); // 2025-11-07 09:30

        // when
        final LocalDate date = slot.getStartAtLocalDate();

        // then
        assertThat(date).isEqualTo(LocalDate.of(2025, 11, 7));
    }

    @Test
    @DisplayName("getStartAtLocalTime() - 시간 부분 추출 검증")
    void getStartAtLocalTime() {
        // given
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(3603); // 2025-11-07 09:30

        // when
        final LocalTime time = slot.getStartAtLocalTime();

        // then
        assertThat(time).isEqualTo(LocalTime.of(9, 30));
    }

    @Test
    @DisplayName("from(LocalDateTime)과 getStartAt 왕복 변환 검증")
    void roundTripConversion() {
        // given
        final LocalDateTime original = LocalDateTime.of(2025, 12, 25, 15, 30);

        // when
        final CompactDateTimeSlot slot = CompactDateTimeSlot.from(original);
        final LocalDate resultDate = slot.getStartAtLocalDate();
        final LocalTime resultTime = slot.getStartAtLocalTime();
        final LocalDateTime result = LocalDateTime.of(resultDate, resultTime);

        // then
        assertThat(result).isEqualTo(original);
    }
}
