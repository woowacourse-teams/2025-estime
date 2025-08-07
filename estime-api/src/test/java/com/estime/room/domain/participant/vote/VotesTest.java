package com.estime.room.domain.participant.vote;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.domain.slot.vo.DateTimeSlot;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class VotesTest {

    @Test
    @DisplayName("정적 팩토리 메소드 from으로 Votes를 생성한다.")
    void from() {
        // given
        final LocalDateTime now = getValidDateTime();
        final Vote vote1 = Vote.of(1L, DateTimeSlot.from(now));
        final Vote vote2 = Vote.of(2L, DateTimeSlot.from(now));
        final List<Vote> voteList = List.of(vote1, vote2);

        // when
        final Votes votes = Votes.from(voteList);

        // then
        assertSoftly(softly -> {
            softly.assertThat(votes.getElements()).hasSize(2);
            softly.assertThat(votes.getElements()).contains(vote1, vote2);
        });
    }

    @Test
    @DisplayName("from 메소드에 null을 전달하면 예외가 발생한다.")
    void from_withNull() {
        // given
        final List<Vote> nullList = null;

        // when & then
        assertThatThrownBy(() -> Votes.from(nullList))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("votes cannot be null");
    }

    @Test
    @DisplayName("remove 메소드로 다른 Votes를 제거(차집합)한다.")
    void subtract() {
        // given
        final LocalDateTime now = getValidDateTime();
        final Vote vote1 = Vote.of(1L, DateTimeSlot.from(now));
        final Vote vote2 = Vote.of(2L, DateTimeSlot.from(now));
        final Vote vote3 = Vote.of(3L, DateTimeSlot.from(now));
        final Votes votes1 = Votes.from(List.of(vote1, vote2, vote3));
        final Votes votes2 = Votes.from(List.of(vote2));

        // when
        final Votes result = votes1.subtract(votes2);

        // then
        assertSoftly(softly -> {
            assertThat(result.getElements()).hasSize(2);
            assertThat(result.getElements()).contains(vote1, vote3);
        });
    }

    @Test
    @DisplayName("calculateStatistic 메소드로 통계를 계산한다.")
    void calculateStatistic() {
        // given
        final LocalDateTime now = getValidDateTime();
        final DateTimeSlot slot1 = DateTimeSlot.from(now);
        final DateTimeSlot slot2 = DateTimeSlot.from(now.plusDays(1));
        final Vote vote1 = Vote.of(1L, slot1);
        final Vote vote2 = Vote.of(2L, slot1);
        final Vote vote3 = Vote.of(1L, slot2);
        final Votes votes = Votes.from(List.of(vote1, vote2, vote3));

        // when
        final Map<DateTimeSlot, Set<Long>> statistic = votes.calculateStatistic();

        // then
        assertSoftly(softly -> {
            assertThat(statistic).hasSize(2);
            assertThat(statistic.get(slot1)).containsExactlyInAnyOrder(1L, 2L);
            assertThat(statistic.get(slot2)).containsExactlyInAnyOrder(1L);
        });
    }

    @Test
    @DisplayName("calculateUniqueStartAts 메소드로 중복 없는 시작 시간을 계산한다.")
    void calculateUniqueStartAts() {
        // given
        final LocalDateTime now = getValidDateTime();
        final DateTimeSlot slot1 = DateTimeSlot.from(now);
        final DateTimeSlot slot2 = DateTimeSlot.from(now); // Same start time
        final DateTimeSlot slot3 = DateTimeSlot.from(now.plusDays(1));
        final Vote vote1 = Vote.of(1L, slot1);
        final Vote vote2 = Vote.of(2L, slot2);
        final Vote vote3 = Vote.of(3L, slot3);
        final Votes votes = Votes.from(List.of(vote1, vote2, vote3));

        // when
        final Set<DateTimeSlot> uniqueStartAts = votes.calculateUniqueStartAts();

        // then
        assertSoftly(softly -> {
            assertThat(uniqueStartAts).hasSize(2);
            assertThat(uniqueStartAts).contains(slot1, slot3);
        });
    }

    @Test
    @DisplayName("isEmpty와 isNotEmpty 메소드가 올바르게 동작한다.")
    void isEmpty_and_isNotEmpty() {
        // given
        final Votes emptyVotes = Votes.from(Collections.emptyList());
        final Votes nonEmptyVotes = Votes.from(List.of(Vote.of(1L, DateTimeSlot.from(getValidDateTime()))));

        // when & then
        assertSoftly(softly -> {
            softly.assertThat(emptyVotes.isEmpty()).isTrue();
            softly.assertThat(emptyVotes.isNotEmpty()).isFalse();
            softly.assertThat(nonEmptyVotes.isEmpty()).isFalse();
            softly.assertThat(nonEmptyVotes.isNotEmpty()).isTrue();
        });
    }

    private LocalDateTime getValidDateTime() {
        return LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
    }
}
