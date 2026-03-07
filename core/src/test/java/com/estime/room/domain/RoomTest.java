package com.estime.room.domain;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.Room;
import com.estime.room.RoomSession;
import com.estime.room.exception.DeadlineOverdueException;
import com.estime.room.exception.PastNotAllowedException;
import com.estime.shared.DomainTerm;
import com.estime.shared.exception.InvalidLengthException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
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
                List.of()
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
                List.of()
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
                List.of()
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
                List.of()
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
                List.of()
        )).doesNotThrowAnyException();
    }

    @DisplayName("마감기한이 현재 시간 이전이면 예외가 발생한다")
    @Test
    void validateDeadline_pastDeadline_throwsException() {
        assertThatThrownBy(() -> Room.withoutId(
                "테스트방",
                roomSession,
                pastDeadline,
                List.of()
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
                List.of()
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
                List.of()
        );

        assertThatThrownBy(() -> room.ensureDeadlineNotPassed(now.plus(2, ChronoUnit.DAYS)))
                .isInstanceOf(DeadlineOverdueException.class)
                .hasMessageContaining(DomainTerm.DEADLINE.name());
    }
}
