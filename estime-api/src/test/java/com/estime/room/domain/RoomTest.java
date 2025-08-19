package com.estime.room.domain;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.estime.common.DomainTerm;
import com.estime.common.exception.domain.DeadlineOverdueException;
import com.estime.common.exception.domain.PastNotAllowedException;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoomTest {

    private final LocalDateTime now = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
    private final DateSlot dateSlot = DateSlot.from(now.toLocalDate().plusDays(1));
    private final TimeSlot timeSlot = TimeSlot.from(LocalTime.of(10, 0));
    private final DateTimeSlot futureDeadline = DateTimeSlot.from(now.plusDays(1));
    private final DateTimeSlot pastDeadline = DateTimeSlot.from(now.minusDays(1));

    @DisplayName("정상적인 값으로 Room 생성 성공")
    @Test
    void createRoom_success() {
        Room room = Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        );

        SoftAssertions.assertSoftly(softly -> {
            softly.assertThat(room.getTitle()).isEqualTo("테스트방");
            softly.assertThat(room.getAvailableDateSlots()).containsExactly(dateSlot);
            softly.assertThat(room.getAvailableTimeSlots()).containsExactly(timeSlot);
            softly.assertThat(room.getDeadline()).isEqualTo(futureDeadline);
        });
    }

    @DisplayName("ensureDeadlineNotPassed - 마감이 지났을 때 예외 발생")
    @Test
    void ensureDeadlineNotPassed_expired_throwException() {
        Room room = Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        );
        assertThatThrownBy(() -> room.ensureDeadlineNotPassed(now.plusDays(2)))
                .isInstanceOf(DeadlineOverdueException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }

    @DisplayName("마감기한이 현재 시간 이전이면 PastNotAllowedException 발생")
    @Test
    void createRoom_pastDeadline_fail() {
        assertThatThrownBy(() ->
                Room.withoutId(
                        "테스트방",
                        List.of(dateSlot),
                        List.of(timeSlot),
                        pastDeadline
                )
        )
                .isInstanceOf(PastNotAllowedException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }

    @DisplayName("ensureDeadlineNotPassed - 아직 마감 전이면 예외 발생 안 함")
    @Test
    void ensureDeadlineNotPassed_notExpired_noException() {
        Room room = Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        );
        assertThatCode(() -> room.ensureDeadlineNotPassed(now))
                .doesNotThrowAnyException();
    }
}
