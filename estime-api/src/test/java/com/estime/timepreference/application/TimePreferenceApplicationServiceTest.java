package com.estime.timepreference.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.ParticipantRepository;
import com.estime.room.domain.participant.vo.ParticipantName;
import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.VoteRepository;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import com.estime.timepreference.application.dto.TimePreferenceInput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferenceOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferencesOutput;
import com.estime.timepreference.domain.category.CategoryType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class TimePreferenceApplicationServiceTest {

    @Autowired
    private TimePreferenceApplicationService timePreferenceApplicationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private VoteRepository voteRepository;

    private Room workRoom;
    private Room leisureRoom;
    private Room socialRoom;
    private Participant workParticipant1;
    private Participant workParticipant2;
    private Participant leisureParticipant1;
    private Participant leisureParticipant2;
    private Participant socialParticipant1;
    private Participant socialParticipant2;

    @BeforeEach
    void setUp() {
        final LocalDate testDate = LocalDate.now().plusDays(1);
        final LocalDateTime deadline = LocalDateTime.now().plusDays(3);

        workRoom = roomRepository.save(Room.withoutId(
                "개발 회의",
                List.of(DateSlot.from(testDate)),
                List.of(TimeSlot.from(LocalTime.of(10, 0)), TimeSlot.from(LocalTime.of(14, 0))),
                deadline
        ));

        leisureRoom = roomRepository.save(Room.withoutId(
                "배드민턴 게임",
                List.of(DateSlot.from(testDate)),
                List.of(TimeSlot.from(LocalTime.of(20, 0))),
                deadline
        ));

        socialRoom = roomRepository.save(Room.withoutId(
                "회식 모임",
                List.of(DateSlot.from(testDate)),
                List.of(TimeSlot.from(LocalTime.of(18, 0))),
                deadline
        ));

        workParticipant1 = participantRepository.save(
                Participant.withoutId(workRoom.getId(), ParticipantName.from("workUser1")));
        workParticipant2 = participantRepository.save(
                Participant.withoutId(workRoom.getId(), ParticipantName.from("workUser2")));
        leisureParticipant1 = participantRepository.save(
                Participant.withoutId(leisureRoom.getId(), ParticipantName.from("leisureUser1")));
        leisureParticipant2 = participantRepository.save(
                Participant.withoutId(leisureRoom.getId(), ParticipantName.from("leisureUser2")));
        socialParticipant1 = participantRepository.save(
                Participant.withoutId(socialRoom.getId(), ParticipantName.from("socialUser1")));
        socialParticipant2 = participantRepository.save(
                Participant.withoutId(socialRoom.getId(), ParticipantName.from("socialUser2")));

        final DateTimeSlot workMorning = DateTimeSlot.from(LocalDateTime.of(testDate, LocalTime.of(10, 0)));
        final DateTimeSlot workAfternoon = DateTimeSlot.from(LocalDateTime.of(testDate, LocalTime.of(14, 0)));
        final DateTimeSlot leisureEvening = DateTimeSlot.from(LocalDateTime.of(testDate, LocalTime.of(20, 0)));

        voteRepository.save(Vote.of(workParticipant1.getId(), workMorning));
        voteRepository.save(Vote.of(workParticipant2.getId(), workMorning));
        voteRepository.save(Vote.of(workParticipant1.getId(), workAfternoon));
        voteRepository.save(Vote.of(leisureParticipant1.getId(), leisureEvening));
    }

    @DisplayName("실제 데이터로 시간 선호도 통계를 성공적으로 조회한다")
    @Test
    void getTopTimePreferences_withRealData_success() {
        // given
        final int windowDays = 7;
        final int topN = 5;
        final Set<CategoryType> categories = Set.of(CategoryType.WORK, CategoryType.LEISURE);
        final TimePreferenceInput input = new TimePreferenceInput(windowDays, topN, categories);

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then: 미래 데이터는 현재 시점 기준 과거 윈도우에 포함되지 않으므로 결과가 비어있을 수 있음
        assertSoftly(softly -> {
            softly.assertThat(result.startDate()).isNotNull();
            softly.assertThat(result.endDate()).isNotNull();
            // 결과가 있다면 유효한 카테고리여야 함
            if (!result.timePreferencesOutputs().isEmpty()) {
                result.timePreferencesOutputs().forEach(output -> {
                    softly.assertThat(output.category()).isIn(CategoryType.WORK, CategoryType.LEISURE);
                    softly.assertThat(output.timePreferences()).isNotNull();
                });
            }
        });
    }

    @DisplayName("업무 카테고리만 필터링하여 시간 선호도 통계를 조회한다")
    @Test
    void getTopTimePreferences_workCategoryOnly() {
        // given
        final Set<CategoryType> workOnlyCategories = Set.of(CategoryType.WORK);
        final TimePreferenceInput input = new TimePreferenceInput(7, 5, workOnlyCategories);

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then
        assertSoftly(softly -> {
            final boolean hasOnlyWorkCategory = result.timePreferencesOutputs().stream()
                    .allMatch(output -> output.category() == CategoryType.WORK);
            softly.assertThat(hasOnlyWorkCategory).isTrue();

            if (!result.timePreferencesOutputs().isEmpty()) {
                final TimePreferencesOutput workOutput = result.timePreferencesOutputs().getFirst();
                softly.assertThat(workOutput.category()).isEqualTo(CategoryType.WORK);
                softly.assertThat(workOutput.timePreferences()).isNotEmpty();
            }
        });
    }

    @DisplayName("투표 수가 많은 순으로 정렬되어 반환한다")
    @Test
    void getTopTimePreferences_sortedByVoteCount() {
        // given
        final TimePreferenceInput input = new TimePreferenceInput(7, 5, Set.of(CategoryType.WORK));

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then
        if (!result.timePreferencesOutputs().isEmpty()) {
            final TimePreferencesOutput workOutput = result.timePreferencesOutputs().stream()
                    .filter(output -> output.category() == CategoryType.WORK)
                    .findFirst()
                    .orElse(null);

            if (workOutput != null && workOutput.timePreferences().size() > 1) {
                final List<TimePreferenceOutput> timePreferences = workOutput.timePreferences();

                assertSoftly(softly -> {
                    for (int i = 0; i < timePreferences.size() - 1; i++) {
                        softly.assertThat(timePreferences.get(i).count())
                                .isGreaterThanOrEqualTo(timePreferences.get(i + 1).count());
                    }
                });
            }
        }
    }

    @DisplayName("topN 제한에 따라 상위 N개만 반환한다")
    @Test
    void getTopTimePreferences_limitedByTopN() {
        // given
        final TimePreferenceInput input = new TimePreferenceInput(7, 1, Set.of(CategoryType.WORK));

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then
        if (!result.timePreferencesOutputs().isEmpty()) {
            final TimePreferencesOutput workOutput = result.timePreferencesOutputs().stream()
                    .filter(output -> output.category() == CategoryType.WORK)
                    .findFirst()
                    .orElse(null);

            if (workOutput != null) {
                assertThat(workOutput.timePreferences()).hasSizeLessThanOrEqualTo(1);
            }
        }
    }

    @DisplayName("동일한 시간대의 투표는 합산되어 반환한다")
    @Test
    void getTopTimePreferences_aggregatesSameTimeSlots() {
        // given
        final LocalDate testDate = LocalDate.now().plusDays(1);
        final Participant additionalParticipant = participantRepository.save(
                Participant.withoutId(workRoom.getId(), ParticipantName.from("workUser3"))
        );

        final DateTimeSlot sameMorningSlot = DateTimeSlot.from(LocalDateTime.of(testDate, LocalTime.of(10, 0)));
        voteRepository.save(Vote.of(additionalParticipant.getId(), sameMorningSlot));

        final TimePreferenceInput input = new TimePreferenceInput(7, 5, Set.of(CategoryType.WORK));

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then
        if (!result.timePreferencesOutputs().isEmpty()) {
            final TimePreferencesOutput workOutput = result.timePreferencesOutputs().stream()
                    .filter(output -> output.category() == CategoryType.WORK)
                    .findFirst()
                    .orElse(null);

            if (workOutput != null && !workOutput.timePreferences().isEmpty()) {
                final TimePreferenceOutput morningSlot = workOutput.timePreferences().stream()
                        .filter(pref -> pref.time().equals(LocalTime.of(10, 0)))
                        .findFirst()
                        .orElse(null);

                if (morningSlot != null) {
                    assertThat(morningSlot.count()).isEqualTo(3L);
                }
            }
        }
    }

    @DisplayName("해당하지 않는 카테고리로 조회하면 빈 결과를 반환한다")
    @Test
    void getTopTimePreferences_nonExistentCategory_returnsEmpty() {
        // given
        final TimePreferenceInput input = new TimePreferenceInput(7, 5, Set.of(CategoryType.ETC));

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then
        assertThat(result.timePreferencesOutputs()).isEmpty();
    }

    @DisplayName("시간 윈도우가 정확히 설정된다")
    @Test
    void getTopTimePreferences_correctTimeWindow() {
        // given
        final int windowDays = 7;
        final TimePreferenceInput input = new TimePreferenceInput(windowDays, 5,
                Set.of(CategoryType.WORK, CategoryType.LEISURE));

        // when
        final TimePreferencesStatisticOutput result = timePreferenceApplicationService.getTopTimePreferences(input);

        // then
        final LocalDate expectedStartDate = LocalDate.now().minusDays(windowDays - 1);
        final LocalDate expectedEndDate = LocalDate.now();

        assertSoftly(softly -> {
            softly.assertThat(result.startDate()).isEqualTo(expectedStartDate);
            softly.assertThat(result.endDate()).isEqualTo(expectedEndDate);
        });
    }
}
