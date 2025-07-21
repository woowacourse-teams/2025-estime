package com.bether.bether.timeslot.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;
import static org.assertj.core.groups.Tuple.tuple;

import com.bether.bether.room.domain.Room;
import com.bether.bether.room.domain.RoomRepository;
import com.bether.bether.timeslot.application.dto.input.TimeSlotInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationOutput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotRecommendationsOutput;
import com.bether.bether.timeslot.application.dto.input.TimeSlotUpdateInput;
import com.bether.bether.timeslot.application.dto.output.TimeSlotStatisticOutput;
import com.bether.bether.timeslot.domain.TimeSlot;
import com.bether.bether.timeslot.domain.TimeSlotRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class TimeSlotServiceTest {

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private RoomRepository roomRepository;

    private static Stream<Arguments> provideUpdateTimeSlotsArguments() {
        return Stream.of(
                Arguments.of(
                        "1번 케이스: 기존 데이터를 새 데이터로 교체",
                        List.of(LocalDateTime.of(2026, 1, 1, 0, 0)),
                        List.of(LocalDateTime.of(2026, 1, 2, 0, 0))
                ),
                Arguments.of(
                        "2번 케이스: 기존 데이터 전체 삭제",
                        List.of(LocalDateTime.of(2026, 1, 1, 0, 0)),
                        List.of()
                ),
                Arguments.of(
                        "3번 케이스: 데이터 부분 업데이트 (유지, 추가, 삭제 혼합)",
                        List.of(
                                LocalDateTime.of(2026, 1, 1, 0, 0),
                                LocalDateTime.of(2026, 1, 2, 0, 0)
                        ),
                        List.of(
                                LocalDateTime.of(2026, 1, 2, 0, 0),
                                LocalDateTime.of(2026, 1, 3, 0, 0)
                        )
                )
        );
    }

    @DisplayName("룸 아이디로 타임슬롯을 가져올 수 있다.")
    @Test
    void getAllByRoomId() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final TimeSlot saved1 = timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", LocalDateTime.now()));
        final TimeSlot saved2 = timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", LocalDateTime.now()));

        // when
        final List<TimeSlot> found = timeSlotService.getAllByRoomId(room.getId());

        // then
        assertThat(found)
                .containsExactlyElementsOf(List.of(saved1, saved2));
    }

    @DisplayName("존재하지 않는 룸 아이디로 조회시 빈 리스트를 반환한다.")
    @Test
    void getAllByNonExistingRoomId() {
        // given // when
        final List<TimeSlot> found = timeSlotService.getAllByRoomId(1234L);

        // then
        assertThat(found)
                .isEmpty();
    }

    @DisplayName("룸 아이디와 유저 이름으로 타임슬롯을 가져올 수 있다.")
    @Test
    void getAllByRoomSessionAndUserName() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final TimeSlot saved1 = timeSlotRepository.save(
                TimeSlot.withoutId(room.getId(), "user1", LocalDateTime.now()));
        final TimeSlot saved2 = timeSlotRepository.save(
                TimeSlot.withoutId(room.getId(), "user2", LocalDateTime.now()));

        // when
        final List<TimeSlot> found = timeSlotService.getAllByRoomIdAndUserName(room.getId(), "user1");

        // then
        assertThat(found)
                .containsExactlyElementsOf(List.of(saved1));
    }

    @DisplayName("존재하지 않는 유저 이름 조회시 빈 리스트를 반환한다.")
    @Test
    void getAllByNonExistingUserName() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final TimeSlot saved1 = timeSlotRepository.save(
                TimeSlot.withoutId(room.getId(), "user1", LocalDateTime.now()));
        final TimeSlot saved2 = timeSlotRepository.save(
                TimeSlot.withoutId(room.getId(), "user1", LocalDateTime.now()));

        // when
        final List<TimeSlot> found = timeSlotService.getAllByRoomIdAndUserName(room.getId(), "user2");

        // then
        assertThat(found)
                .isEmpty();
    }

    @DisplayName("다수의 타임슬롯을 저장할 수 있다.")
    @Test
    void saveAll() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final TimeSlotInput input = new TimeSlotInput(UUID.randomUUID(), "user",
                List.of(LocalDateTime.now(), LocalDateTime.now()));

        // when
        final List<TimeSlot> actual = timeSlotService.saveAll(room.getId(), input);

        // then
        assertThat(actual)
                .hasSize(2);
    }

    @DisplayName("타임슬롯 통계를 계산한다.")
    @Test
    void calculateStatistic() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);
        final LocalDateTime dateTime2 = LocalDateTime.of(2024, 3, 1, 2, 30);

        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", dateTime1));
        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", dateTime2));
        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user2", dateTime1));

        // when
        final TimeSlotStatisticOutput output = timeSlotService.generateTimeSlotStatistic(room.getId());

        // then
        assertThat(output.statistic())
                .hasSize(2)
                .extracting("dateTime", "userNames")
                .containsExactlyInAnyOrder(
                        tuple(dateTime1, List.of("user", "user2")),
                        tuple(dateTime2, List.of("user"))
                );
    }

    @DisplayName("타임슬롯 추천 시간 순위를 계산한다.")
    @Test
    void calculateRecommendations() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);
        final LocalDateTime dateTime2 = LocalDateTime.of(2024, 3, 1, 2, 30);

        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", dateTime1));
        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", dateTime2));
        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user2", dateTime1));

        // when
        final TimeSlotRecommendationsOutput output = timeSlotService.recommendTopTimeSlots(room.getId());

        // then
        assertThat(output.recommendations())
                .hasSize(2)
                .containsExactly(
                        new TimeSlotRecommendationOutput(dateTime1, List.of("user", "user2")),
                        new TimeSlotRecommendationOutput(dateTime2, List.of("user"))
                );
    }

    @DisplayName("특정 사용자가 저장한 타임슬롯을 제시한 날짜로 변경할 수 있다.")
    @ParameterizedTest(name = "{0}")
    @MethodSource(value = "provideUpdateTimeSlotsArguments")
    void updateTimeSlots(final String testName, final List<LocalDateTime> existed, final List<LocalDateTime> updated) {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final String userName = "user";
        final List<TimeSlot> existedTimeSlot = existed.stream()
                .map(dateTime -> TimeSlot.withoutId(room.getId(), "existed", dateTime))
                .toList();
        timeSlotRepository.saveAll(existedTimeSlot);

        final TimeSlotUpdateInput input = new TimeSlotUpdateInput(UUID.randomUUID(), userName, updated);

        // when
        timeSlotService.updateTimeSlots(room.getId(), input);

        // then
        final List<TimeSlot> saved = timeSlotRepository.findAllByRoomIdAndUserName(room.getId(), userName);

        assertThat(saved)
                .hasSize(updated.size())
                .extracting("startAt")
                .containsExactlyInAnyOrderElementsOf(updated);
    }

    @Test
    @DisplayName("타임슬롯 변경은 멱등성을 보장한다.")
    void updateTimeSlotsIsIdempotent() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));
        final String userName = "user";

        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), userName, LocalDateTime.of(2026, 1, 1, 0, 0)));

        final List<LocalDateTime> updatedSlots = List.of(
                LocalDateTime.of(2026, 1, 2, 10, 0),
                LocalDateTime.of(2026, 1, 2, 11, 0)
        );
        final TimeSlotUpdateInput input = new TimeSlotUpdateInput(UUID.randomUUID(), userName, updatedSlots);

        // when
        timeSlotService.updateTimeSlots(room.getId(), input);
        final List<TimeSlot> resultAfterFirstCall = timeSlotRepository.findAllByRoomIdAndUserName(room.getId(),
                userName);

        timeSlotService.updateTimeSlots(room.getId(), input);
        final List<TimeSlot> resultAfterSecondCall = timeSlotRepository.findAllByRoomIdAndUserName(room.getId(),
                userName);

        // then
        assertSoftly(softly -> {
            softly.assertThat(resultAfterFirstCall)
                    .as("첫 번째 호출 후, 타임슬롯 개수가 기대값과 일치하는지 검증")
                    .hasSize(updatedSlots.size());
            softly.assertThat(resultAfterFirstCall)
                    .extracting("startAt")
                    .as("첫 번째 호출 후, 타임슬롯 내용이 기대값과 일치하는지 검증")
                    .containsExactlyInAnyOrderElementsOf(updatedSlots);
            softly.assertThat(resultAfterSecondCall)
                    .as("두 번째 호출 결과가 첫 번째 호출 결과와 동일한지 멱등성 검증")
                    .containsExactlyInAnyOrderElementsOf(resultAfterFirstCall);
        });
    }

    @DisplayName("타임슬롯 투표 시간이 최대 랭킹 수보다 적은 경우, 존재하는 개수 만큼 반환한다.")
    @Test
    void whenSmallerThanMaxRankingNumber() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0)
                ));

        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);

        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user", dateTime1));
        timeSlotRepository.save(TimeSlot.withoutId(room.getId(), "user2", dateTime1));

        // when
        final TimeSlotRecommendationsOutput output = timeSlotService.recommendTopTimeSlots(room.getId());

        // then
        assertThat(output.recommendations())
                .hasSize(1)
                .containsExactly(
                        new TimeSlotRecommendationOutput(dateTime1, List.of("user", "user2"))
                );
    }
}
