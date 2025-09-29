package com.estime.room.domain;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.common.DomainTerm;
import com.estime.common.exception.DeadlineOverdueException;
import com.estime.common.exception.InvalidLengthException;
import com.estime.common.exception.PastNotAllowedException;
import com.estime.room.Room;
import com.estime.room.timeslot.DateSlot;
import com.estime.room.timeslot.TimeSlot;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoomTest {

    private final LocalDateTime now = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
    private final DateSlot dateSlot = DateSlot.from(now.toLocalDate().plusDays(1));
    private final TimeSlot timeSlot = TimeSlot.from(LocalTime.of(10, 0));
    private final LocalDateTime futureDeadline = now.plusDays(1);
    private final LocalDateTime pastDeadline = now.minusDays(1);

    @DisplayName("정상적인 값으로 Room 생성을 성공한다")
    @Test
    void createRoom_success() {
        final Room room = Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        );

        assertSoftly(softly -> {
            softly.assertThat(room.getTitle()).isEqualTo("테스트방");
            softly.assertThat(room.getAvailableDateSlots()).containsExactly(dateSlot);
            softly.assertThat(room.getAvailableTimeSlots()).containsExactly(timeSlot);
            softly.assertThat(room.getDeadline()).isEqualTo(futureDeadline);
        });
    }

    @DisplayName("제목이 최대 길이(20)와 같으면 예외가 발생하지 않는다")
    @Test
    void validateTitle_exactMaxLength_noException() {
        // given
        final String exactLengthTitle = "이십글자제목입니다이십글자";

        // when & then
        assertThatCode(() -> Room.withoutId(
                exactLengthTitle,
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        )).doesNotThrowAnyException();
    }

    @DisplayName("제목이 최대 길이(20)를 초과하면 예외가 발생한다")
    @Test
    void validateTitle_exceedMaxLength_throwsException() {
        // given
        final String invalidTitle = "제목이 너무 길어서 예외가 발생하는 경우입니다";

        // when & then
        assertThatThrownBy(() -> Room.withoutId(
                invalidTitle,
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        )).isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.ROOM.name());
    }

    @DisplayName("제목이 빈 문자열이면 예외가 발생한다")
    @Test
    void validateTitle_blank_throwsException() {
        // given
        final String blankTitle = "   ";

        // when & then
        assertThatThrownBy(() -> Room.withoutId(
                blankTitle,
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        )).isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.ROOM.name());
    }

    @DisplayName("마감기한이 현재 시간 이후이면 예외가 발생하지 않는다")
    @Test
    void validateDeadline_futureDeadline_noException() {
        assertThatCode(() -> Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        )).doesNotThrowAnyException();
    }

    @DisplayName("마감기한이 현재 시간 이전이면 예외가 발생한다")
    @Test
    void validateDeadline_pastDeadline_throwsException() {
        assertThatThrownBy(() -> Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                pastDeadline
        )).isInstanceOf(PastNotAllowedException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }

    @DisplayName("선택 가능한 날짜가 현재 날짜와 같으면 예외가 발생하지 않는다")
    @Test
    void validateAvailableDateSlots_today_noException() {
        // given
        final DateSlot todayDateSlot = DateSlot.from(now.toLocalDate());

        // when & then
        assertThatCode(() -> Room.withoutId(
                "테스트방",
                List.of(todayDateSlot),
                List.of(timeSlot),
                futureDeadline
        )).doesNotThrowAnyException();
    }

    @DisplayName("선택 가능한 날짜가 현재 날짜 이전이면 예외가 발생한다")
    @Test
    void validateAvailableDateSlots_pastDate_throwsException() {
        // given
        final DateSlot pastDateSlot = DateSlot.from(now.toLocalDate().minusDays(1));

        // when & then
        assertThatThrownBy(() -> Room.withoutId(
                "테스트방",
                List.of(pastDateSlot),
                List.of(timeSlot),
                futureDeadline
        )).isInstanceOf(PastNotAllowedException.class)
                .hasMessageContaining(DomainTerm.DATE_SLOT.name());
    }

    @DisplayName("마감기한이 지나지 않았을 때 예외가 발생하지 않는다")
    @Test
    void ensureDeadlineNotPassed_notExpired_noException() {
        final Room room = Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        );

        assertThatCode(() -> room.ensureDeadlineNotPassed(now))
                .doesNotThrowAnyException();
    }

    @DisplayName("마감기한이 지났을 때 예외가 발생한다")
    @Test
    void ensureDeadlineNotPassed_expired_throwException() {
        final Room room = Room.withoutId(
                "테스트방",
                List.of(dateSlot),
                List.of(timeSlot),
                futureDeadline
        );

        assertThatThrownBy(() -> room.ensureDeadlineNotPassed(now.plusDays(2)))
                .isInstanceOf(DeadlineOverdueException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }
}
