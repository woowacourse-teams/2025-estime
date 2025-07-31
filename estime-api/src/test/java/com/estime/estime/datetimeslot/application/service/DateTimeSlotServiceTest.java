package com.estime.estime.datetimeslot.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.SoftAssertions.assertSoftly;
import static org.assertj.core.groups.Tuple.tuple;

import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotInput;
import com.estime.estime.datetimeslot.application.dto.input.DateTimeSlotUpdateInput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationOutput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotRecommendationsOutput;
import com.estime.estime.datetimeslot.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.estime.datetimeslot.domain.DateTimeSlot;
import com.estime.estime.datetimeslot.domain.DateTimeSlotRepository;
import com.estime.estime.datetimeslot.domain.DateTimeSlots;
import com.estime.estime.room.domain.Room;
import com.estime.estime.room.domain.RoomRepository;
import com.estime.estime.room.infrastructure.RoomSessionGenerator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
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
class DateTimeSlotServiceTest {

    @Autowired
    private DateTimeSlotService dateTimeSlotService;

    @Autowired
    private DateTimeSlotRepository dateTimeSlotRepository;

    @Autowired
    private RoomRepository roomRepository;

    private static Stream<Arguments> provideUpdateDateTimeSlotsArguments() {
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

    @DisplayName("룸 아이디로 DT슬롯을 가져올 수 있다.")
    @Test
    void getAllByRoomId() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final DateTimeSlot saved1 = dateTimeSlotRepository.save(
                DateTimeSlot.withoutId(room.getId(), "user", LocalDateTime.now()));
        final DateTimeSlot saved2 = dateTimeSlotRepository.save(
                DateTimeSlot.withoutId(room.getId(), "user", LocalDateTime.now()));

        // when
        final List<DateTimeSlot> found = dateTimeSlotService.getAllByRoomId(room.getId()).getDateTimeSlots();

        // then
        assertThat(found)
                .containsExactlyElementsOf(List.of(saved1, saved2));
    }

    @DisplayName("존재하지 않는 룸 아이디로 조회시 빈 리스트를 반환한다.")
    @Test
    void getAllByNonExistingRoomId() {
        // given // when
        final List<DateTimeSlot> found = dateTimeSlotService.getAllByRoomId(1234L).getDateTimeSlots();

        // then
        assertThat(found)
                .isEmpty();
    }

    @DisplayName("룸 아이디와 유저 이름으로 DT슬롯을 가져올 수 있다.")
    @Test
    void getAllByRoomSessionAndUserName() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final DateTimeSlot saved1 = dateTimeSlotRepository.save(
                DateTimeSlot.withoutId(room.getId(), "user1", LocalDateTime.now()));
        final DateTimeSlot saved2 = dateTimeSlotRepository.save(
                DateTimeSlot.withoutId(room.getId(), "user2", LocalDateTime.now()));

        // when
        final List<DateTimeSlot> found = dateTimeSlotService.getAllByRoomIdAndUserName(room.getId(), "user1")
                .getDateTimeSlots();

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
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final DateTimeSlot saved1 = dateTimeSlotRepository.save(
                DateTimeSlot.withoutId(room.getId(), "user1", LocalDateTime.now()));
        final DateTimeSlot saved2 = dateTimeSlotRepository.save(
                DateTimeSlot.withoutId(room.getId(), "user1", LocalDateTime.now()));

        // when
        final List<DateTimeSlot> found = dateTimeSlotService.getAllByRoomIdAndUserName(room.getId(), "user2")
                .getDateTimeSlots();

        // then
        assertThat(found)
                .isEmpty();
    }

    @DisplayName("다수의 DT슬롯을 저장할 수 있다.")
    @Test
    void saveAll() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final DateTimeSlotInput input = new DateTimeSlotInput(RoomSessionGenerator.generateTsid(), "user",
                List.of(LocalDateTime.now(), LocalDateTime.now()));

        // when
        final List<DateTimeSlot> actual = dateTimeSlotService.saveAll(room.getId(), input).getDateTimeSlots();

        // then
        assertThat(actual)
                .hasSize(2);
    }

    @DisplayName("DT슬롯 통계를 계산한다.")
    @Test
    void calculateStatistic() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);
        final LocalDateTime dateTime2 = LocalDateTime.of(2024, 3, 1, 2, 30);

        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user", dateTime1));
        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user", dateTime2));
        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user2", dateTime1));

        // when
        final DateTimeSlotStatisticOutput output = dateTimeSlotService.generateDateTimeSlotStatistic(room.getId());

        // then
        assertThat(output.statistic())
                .hasSize(2)
                .extracting("dateTime", "userNames")
                .containsExactlyInAnyOrder(
                        tuple(dateTime1, List.of("user", "user2")),
                        tuple(dateTime2, List.of("user"))
                );
    }

    @DisplayName("DT슬롯 추천 시간 순위를 계산한다.")
    @Test
    void calculateRecommendations() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);
        final LocalDateTime dateTime2 = LocalDateTime.of(2024, 3, 1, 2, 30);

        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user", dateTime1));
        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user", dateTime2));
        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user2", dateTime1));

        // when
        final DateTimeSlotRecommendationsOutput output = dateTimeSlotService.recommendTopDateTimeSlots(room.getId());

        // then
        assertThat(output.recommendations())
                .hasSize(2)
                .containsExactly(
                        new DateTimeSlotRecommendationOutput(dateTime1, List.of("user", "user2")),
                        new DateTimeSlotRecommendationOutput(dateTime2, List.of("user"))
                );
    }

    @DisplayName("특정 사용자가 저장한 DT슬롯을 제시한 날짜로 변경할 수 있다.")
    @ParameterizedTest(name = "{0}")
    @MethodSource(value = "provideUpdateDateTimeSlotsArguments")
    void updateDateTimeSlots(final String testName, final List<LocalDateTime> existed,
                             final List<LocalDateTime> updated) {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final String userName = "user";
        final List<DateTimeSlot> existedDateTimeSlot = existed.stream()
                .map(dateTime -> DateTimeSlot.withoutId(room.getId(), "existed", dateTime))
                .toList();
        dateTimeSlotRepository.saveAll(DateTimeSlots.from(existedDateTimeSlot));

        final DateTimeSlotUpdateInput input = new DateTimeSlotUpdateInput(RoomSessionGenerator.generateTsid(), userName,
                updated);

        // when
        dateTimeSlotService.updateDateTimeSlots(room.getId(), input);

        // then
        final List<DateTimeSlot> saved = dateTimeSlotRepository.findAllByRoomIdAndUserName(room.getId(), userName)
                .getDateTimeSlots();

        assertThat(saved)
                .hasSize(updated.size())
                .extracting("startAt")
                .containsExactlyInAnyOrderElementsOf(updated);
    }

    @Test
    @DisplayName("DT슬롯 변경은 멱등성을 보장한다.")
    void updateDateTimeSlotsIsIdempotent() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));
        final String userName = "user";

        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), userName, LocalDateTime.of(2026, 1, 1, 0, 0)));

        final List<LocalDateTime> updatedSlots = List.of(
                LocalDateTime.of(2026, 1, 2, 10, 0),
                LocalDateTime.of(2026, 1, 2, 11, 0)
        );
        final DateTimeSlotUpdateInput input = new DateTimeSlotUpdateInput(RoomSessionGenerator.generateTsid(), userName,
                updatedSlots);

        // when
        dateTimeSlotService.updateDateTimeSlots(room.getId(), input);
        final List<DateTimeSlot> resultAfterFirstCall = dateTimeSlotRepository.findAllByRoomIdAndUserName(room.getId(),
                userName).getDateTimeSlots();

        dateTimeSlotService.updateDateTimeSlots(room.getId(), input);
        final List<DateTimeSlot> resultAfterSecondCall = dateTimeSlotRepository.findAllByRoomIdAndUserName(room.getId(),
                userName).getDateTimeSlots();

        // then
        assertSoftly(softly -> {
            softly.assertThat(resultAfterFirstCall)
                    .as("첫 번째 호출 후, DT슬롯 개수가 기대값과 일치하는지 검증")
                    .hasSize(updatedSlots.size());
            softly.assertThat(resultAfterFirstCall)
                    .extracting("startAt")
                    .as("첫 번째 호출 후, DT슬롯 내용이 기대값과 일치하는지 검증")
                    .containsExactlyInAnyOrderElementsOf(updatedSlots);
            softly.assertThat(resultAfterSecondCall)
                    .as("두 번째 호출 결과가 첫 번째 호출 결과와 동일한지 멱등성 검증")
                    .containsExactlyInAnyOrderElementsOf(resultAfterFirstCall);
        });
    }

    @DisplayName("DT슬롯 투표 시간이 최대 랭킹 수보다 적은 경우, 존재하는 개수 만큼 반환한다.")
    @Test
    void whenSmallerThanMaxRankingNumber() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "title",
                        List.of(LocalDate.now()),
                        LocalTime.of(7, 0),
                        LocalTime.of(20, 0),
                        LocalDateTime.of(2026, 1, 1, 0, 0),
                        true
                ));

        final LocalDateTime dateTime1 = LocalDateTime.of(2024, 1, 1, 0, 0);

        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user", dateTime1));
        dateTimeSlotRepository.save(DateTimeSlot.withoutId(room.getId(), "user2", dateTime1));

        // when
        final DateTimeSlotRecommendationsOutput output = dateTimeSlotService.recommendTopDateTimeSlots(room.getId());

        // then
        assertThat(output.recommendations())
                .hasSize(1)
                .containsExactly(
                        new DateTimeSlotRecommendationOutput(dateTime1, List.of("user", "user2"))
                );
    }
}
