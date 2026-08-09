package com.estime.room.domain;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.Room;
import com.estime.room.RoomSession;
import com.estime.room.exception.DeadlineOverdueException;
import com.estime.room.exception.PastNotAllowedException;
import com.estime.room.slot.DateTimeSlot;
import com.estime.shared.DomainTerm;
import com.estime.shared.exception.InvalidLengthException;
import com.estime.shared.exception.MaxCountExceededException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoomTest {

    private static final RoomSession roomSession = RoomSession.from("testRoomSession");

    private final Instant now = Instant.now().truncatedTo(ChronoUnit.HOURS);
    private final Instant futureDeadline = now.plus(1, ChronoUnit.DAYS);
    private final Instant pastDeadline = now.minus(1, ChronoUnit.DAYS);

    @DisplayName("정상적인 값으로 Room 생성을 성공한다")
    @Test
    void createRoom_success() {
        final Room room = Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                List.of(),
                now
        );

        assertSoftly(softly -> {
            softly.assertThat(room.getTitle()).isEqualTo("테스트방");
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
                roomSession,
                futureDeadline,
                List.of(),
                now
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
                roomSession,
                futureDeadline,
                List.of(),
                now
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
                roomSession,
                futureDeadline,
                List.of(),
                now
        )).isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.ROOM.name());
    }

    @DisplayName("마감기한이 현재 시간 이후이면 예외가 발생하지 않는다")
    @Test
    void validateDeadline_futureDeadline_noException() {
        assertThatCode(() -> Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                List.of(),
                now
        )).doesNotThrowAnyException();
    }

    @DisplayName("마감기한이 현재 시간 이전이면 예외가 발생한다")
    @Test
    void validateDeadline_pastDeadline_throwsException() {
        assertThatThrownBy(() -> Room.withoutId(
                "테스트방",
                roomSession,
                pastDeadline,
                List.of(),
                now
        )).isInstanceOf(PastNotAllowedException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }

    @DisplayName("마감기한이 지나지 않았을 때 예외가 발생하지 않는다")
    @Test
    void ensureDeadlineNotPassed_notExpired_noException() {
        final Room room = Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                List.of(),
                now
        );

        assertThatCode(() -> room.ensureDeadlineNotPassed(now))
                .doesNotThrowAnyException();
    }

    @DisplayName("마감기한이 지났을 때 예외가 발생한다")
    @Test
    void ensureDeadlineNotPassed_expired_throwException() {
        final Room room = Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                List.of(),
                now
        );

        assertThatThrownBy(() -> room.ensureDeadlineNotPassed(now.plus(2, ChronoUnit.DAYS)))
                .isInstanceOf(DeadlineOverdueException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }

    @DisplayName("선택 날짜가 최대 개수(90)와 같으면 예외가 발생하지 않는다")
    @Test
    void validateAvailableDatesCount_exactMaxCount_noException() {
        // given
        final List<DateTimeSlot> slots = slotsOverDates(90, 1);

        // when & then
        assertThatCode(() -> Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                slots,
                now
        )).doesNotThrowAnyException();
    }

    @DisplayName("선택 날짜가 최대 개수(90)를 초과하면 예외가 발생한다")
    @Test
    void validateAvailableDatesCount_exceedMaxCount_throwsException() {
        // given
        final List<DateTimeSlot> slots = slotsOverDates(91, 1);

        // when & then
        assertThatThrownBy(() -> Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                slots,
                now
        )).isInstanceOf(MaxCountExceededException.class)
                .hasMessageContaining(DomainTerm.DATE_SLOT.name());
    }

    @DisplayName("날짜 수가 상한 이하이면 하루에 모든 시간을 선택해도 예외가 발생하지 않는다")
    @Test
    void validateAvailableDatesCount_maxDatesWithAllTimeSlots_noException() {
        // given: 90일 × 48슬롯 = 4320개 — 상한 기준은 슬롯 개수가 아니라 날짜 개수다
        final List<DateTimeSlot> slots = slotsOverDates(90, 48);

        // when & then
        assertThatCode(() -> Room.withoutId(
                "테스트방",
                roomSession,
                futureDeadline,
                slots,
                now
        )).doesNotThrowAnyException();
    }

    private List<DateTimeSlot> slotsOverDates(final int dateCount, final int slotsPerDate) {
        // dayOffset 경계인 KST 자정을 기준으로 만들어야 하루치 슬롯이 다음 날로 넘어가지 않는다
        final ZoneId zone = ZoneId.of("Asia/Seoul");
        final Instant firstDate = LocalDate.now(zone).plusDays(1).atStartOfDay(zone).toInstant();

        return IntStream.range(0, dateCount)
                .boxed()
                .flatMap(dateIndex -> IntStream.range(0, slotsPerDate)
                        .mapToObj(slotIndex -> DateTimeSlot.from(
                                firstDate.plus(dateIndex, ChronoUnit.DAYS)
                                        .plus(DateTimeSlot.UNIT.multipliedBy(slotIndex))
                        )))
                .toList();
    }
}
