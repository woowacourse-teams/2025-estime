package com.estime.room.v2;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.slot.CompactDateTimeSlot;
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
}
