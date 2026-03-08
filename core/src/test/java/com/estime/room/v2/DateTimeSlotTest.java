package com.estime.room.v2;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.slot.DateTimeSlot;
import com.estime.room.slot.exception.DateTimeSlotOutOfRangeException;
import com.estime.room.slot.exception.InvalidTimeDetailException;
import com.estime.room.slot.exception.SlotNotDivideException;
import com.estime.shared.exception.NullNotAllowedException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("DateTimeSlot 테스트")
class DateTimeSlotTest {

    @Test
    @DisplayName("압축된 슬롯 코드로부터 생성")
    void createFromEncodedValue() {
        // given
        final int encoded = 28; // 0x0001C

        // when
        final DateTimeSlot slot = DateTimeSlot.from(encoded);

        // then
        assertThat(slot.getEncoded()).isEqualTo(28);
    }

    @Test
    @DisplayName("슬롯 비교 - 작은 값이 먼저")
    void compareSlots() {
        // given
        final DateTimeSlot slot1 = DateTimeSlot.from(28);    // 2025-10-24 14:00
        final DateTimeSlot slot2 = DateTimeSlot.from(3603);  // 2025-11-07 09:30

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
        final DateTimeSlot slot1 = DateTimeSlot.from(28);
        final DateTimeSlot slot2 = DateTimeSlot.from(28);

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
        final DateTimeSlot slot1 = DateTimeSlot.from(28);     // 2025-10-24 14:00
        final DateTimeSlot slot2 = DateTimeSlot.from(3603);   // 2025-11-07 09:30

        // when
        final String result1 = slot1.toString();
        final String result2 = slot2.toString();

        // then
        assertSoftly(softly -> {
            assertThat(result1).isEqualTo("2025-10-24T05:00:00Z ~ 2025-10-24T05:30:00Z (28)");
            assertThat(result2).isEqualTo("2025-11-07T00:30:00Z ~ 2025-11-07T01:00:00Z (3603)");
        });
    }

    @Test
    @DisplayName("from(int) - 음수 값으로 생성 시 예외 발생")
    void createFromNegativeValue() {
        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(-1))
                .isInstanceOf(DateTimeSlotOutOfRangeException.class);
    }

    @Test
    @DisplayName("from(int) - 최대값 초과 시 예외 발생")
    void createFromValueExceedingMax() {
        // given: 0xFFFFFF = 16777215 초과
        final int exceedingValue = 0xFFFFFF + 1;

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(exceedingValue))
                .isInstanceOf(DateTimeSlotOutOfRangeException.class);
    }

    @Test
    @DisplayName("from(int) - 경계값 0으로 생성 성공")
    void createFromMinValue() {
        // given
        final int minValue = 0;

        // when
        final DateTimeSlot slot = DateTimeSlot.from(minValue);

        // then
        assertThat(slot.getEncoded()).isEqualTo(0);
        // EPOCH: 2025-10-24 00:00 KST = 2025-10-23T15:00:00Z
        assertThat(slot.getStartAt()).isEqualTo(Instant.parse("2025-10-23T15:00:00Z"));
    }

    @Test
    @DisplayName("from(int) - 경계값 최대값(0xFFFFFF)으로 생성 성공")
    void createFromMaxValue() {
        // given
        final int maxValue = 0xFFFFFF; // 16777215

        // when
        final DateTimeSlot slot = DateTimeSlot.from(maxValue);

        // then
        assertThat(slot.getEncoded()).isEqualTo(maxValue);
    }

    @Test
    @DisplayName("from(Instant) - null 값으로 생성 시 예외 발생")
    void createFromNullDateTime() {
        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from((Instant) null))
                .isInstanceOf(NullNotAllowedException.class);
    }

    @Test
    @DisplayName("from(Instant) - 30분 단위가 아닌 시간으로 생성 시 예외 발생")
    void createFromInvalidMinute() {
        // given: 14:15 KST (30분 단위 아님)
        final Instant invalidTime = LocalDateTime.of(2025, 10, 24, 14, 15)
                .atZone(ZoneId.of("Asia/Seoul")).toInstant();

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(invalidTime))
                .isInstanceOf(SlotNotDivideException.class);
    }

    @Test
    @DisplayName("from(Instant) - 초가 0이 아닌 시간으로 생성 시 예외 발생")
    void createFromNonZeroSecond() {
        // given: 14:00:30 KST (초가 0이 아님)
        final Instant invalidTime = LocalDateTime.of(2025, 10, 24, 14, 0, 30)
                .atZone(ZoneId.of("Asia/Seoul")).toInstant();

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class);
    }

    @Test
    @DisplayName("from(Instant) - 나노초가 0이 아닌 시간으로 생성 시 예외 발생")
    void createFromNonZeroNano() {
        // given: 14:00:00.000000001 KST (나노초가 0이 아님)
        final Instant invalidTime = LocalDateTime.of(2025, 10, 24, 14, 0, 0, 1)
                .atZone(ZoneId.of("Asia/Seoul")).toInstant();

        // when & then
        assertThatThrownBy(() -> DateTimeSlot.from(invalidTime))
                .isInstanceOf(InvalidTimeDetailException.class);
    }

    @Test
    @DisplayName("from(Instant) - EPOCH 시작 시간(2025-10-24 00:00 KST)으로 생성 성공")
    void createFromEpochStart() {
        // given: EPOCH의 시작 시간 (2025-10-24 00:00 KST = 2025-10-23T15:00:00Z)
        final Instant epochStart = LocalDateTime.of(2025, 10, 24, 0, 0)
                .atZone(ZoneId.of("Asia/Seoul")).toInstant();

        // when
        final DateTimeSlot slot = DateTimeSlot.from(epochStart);

        // then
        assertThat(slot.getEncoded()).isEqualTo(0);
        assertThat(slot.getStartAt()).isEqualTo(Instant.parse("2025-10-23T15:00:00Z"));
    }

    @Test
    @DisplayName("from(Instant) - 23:30 KST (하루의 마지막 슬롯)으로 생성 성공")
    void createFromLastSlotOfDay() {
        // given: 23:30 KST (하루의 마지막 30분 슬롯) = 14:30 UTC
        final Instant lastSlot = LocalDateTime.of(2025, 10, 24, 23, 30)
                .atZone(ZoneId.of("Asia/Seoul")).toInstant();

        // when
        final DateTimeSlot slot = DateTimeSlot.from(lastSlot);

        // then
        assertThat(slot.getStartAt()).isEqualTo(Instant.parse("2025-10-24T14:30:00Z"));
    }

    @Test
    @DisplayName("getStartAt() - 슬롯 시작 시간 변환 검증")
    void getStartAtConversion() {
        // given: 2025-11-07 09:30 KST = 2025-11-07T00:30:00Z
        final DateTimeSlot slot = DateTimeSlot.from(3603);

        // when
        final Instant instant = slot.getStartAt();

        // then
        assertThat(instant).isEqualTo(Instant.parse("2025-11-07T00:30:00Z"));
    }

    @Test
    @DisplayName("from(Instant)과 getStartAt() 왕복 변환 검증")
    void roundTripConversion() {
        // given: 2025-12-25 15:30 KST = 2025-12-25T06:30:00Z
        final Instant original = LocalDateTime.of(2025, 12, 25, 15, 30)
                .atZone(ZoneId.of("Asia/Seoul")).toInstant();

        // when
        final DateTimeSlot slot = DateTimeSlot.from(original);
        final Instant result = slot.getStartAt();

        // then
        assertThat(result).isEqualTo(original);
    }
}
