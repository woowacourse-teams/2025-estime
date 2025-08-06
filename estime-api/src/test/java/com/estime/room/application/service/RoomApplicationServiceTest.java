package com.estime.room.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.ParticipantRepository;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.estime.room.domain.slot.vo.TimeSlot;
import com.estime.room.domain.vo.RoomSession;
import com.github.f4b6a3.tsid.Tsid;
import com.github.f4b6a3.tsid.TsidCreator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class RoomApplicationServiceTest {

    @Autowired
    private RoomApplicationService roomApplicationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @DisplayName("방을 생성할 수 있다.")
    @Test
    void saveRoom() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0))
        );

        // when
        final RoomCreateOutput saved = roomApplicationService.saveRoom(input);

        // then
        assertThat(isValidSession(saved.session()))
                .isTrue();
    }

    @DisplayName("세션을 기반으로 방을 조회할 수 있다.")
    @Test
    void getRoomBySession() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0))
        );
        final RoomCreateOutput saved = roomApplicationService.saveRoom(input);

        // when
        final RoomOutput output = roomApplicationService.getRoomBySession(saved.session().getTsid());

        // then
        assertSoftly(softAssertions -> {
            softAssertions.assertThat(output.title())
                    .isEqualTo(input.title());
            softAssertions.assertThat(output.availableDateSlots())
                    .containsExactlyInAnyOrderElementsOf(input.availableDateSlots());
            softAssertions.assertThat(output.availableTimeSlots())
                    .containsExactlyInAnyOrderElementsOf(input.availableTimeSlots());
            softAssertions.assertThat(output.deadline())
                    .isEqualTo(input.deadline());
            softAssertions.assertThat(output.roomSession())
                    .isEqualTo(saved.session());
        });
    }

    @DisplayName("존재하지 않는 세션을 기반으로 방 조회 시 예외가 발생한다.")
    @Test
    void getRoomByNonexistentSession() {
        // given
        final Tsid nonexistentSession = TsidCreator.getTsid();

        // when // then
        assertThatThrownBy(() -> roomApplicationService.getRoomBySession(nonexistentSession))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Room not found");
    }

    @DisplayName("DateSlot이 null이면 예외가 발생한다.")
    @Test
    void saveWithNullDateSlots() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                null,
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2026, 1, 1, 0, 0))
        );

        // when // then
        assertThatThrownBy(() -> roomApplicationService.saveRoom(input))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("availableDateSlots cannot be null");
    }

    @DisplayName("마감 시간이 과거이면 예외가 발생한다.")
    @Test
    void saveWithPastDeadline() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(DateSlot.from(LocalDate.now())),
                List.of(TimeSlot.from(LocalTime.of(7, 0)), TimeSlot.from(LocalTime.of(20, 0))),
                DateTimeSlot.from(LocalDateTime.of(2000, 1, 1, 0, 0))
        );

        // when // then
        assertThatThrownBy(() -> roomApplicationService.saveRoom(input))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("deadline cannot be in the past");
    }

    @DisplayName("중복된 이름의 참여자를 확인할 수 있다.")
    @Test
    void canCheckDuplicatedParticipantName() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "test",
                        List.of(DateSlot.from(LocalDate.now().plusDays(1)),
                                DateSlot.from(LocalDate.now().plusDays(2)),
                                DateSlot.from(LocalDate.now().plusDays(3))),
                        List.of(TimeSlot.from(LocalTime.of(10, 0)),
                                TimeSlot.from(LocalTime.of(10, 30)),
                                TimeSlot.from(LocalTime.of(11, 0)),
                                TimeSlot.from(LocalTime.of(11, 30))),
                        DateTimeSlot.from(
                                LocalDateTime.of(
                                        LocalDate.now().plusDays(3), LocalTime.of(10, 0)))
                ));

        final Participant participant = participantRepository.save(Participant.withoutId(room.getId(), "강산"));
        System.out.println(participant);

        // when
        final ParticipantCheckOutput output = roomApplicationService.checkParticipantExists(
                room.getSession().getTsid(), "강산");

        // then
        assertThat(output.exists()).isTrue();
    }

    @DisplayName("하나의 방에 중복된 이름의 참여자를 만들 수 없다.")
    @Test
    void cannotCreateDuplicateParticipantName() {
        // given
        final Room room = roomRepository.save(
                Room.withoutId(
                        "test",
                        List.of(DateSlot.from(LocalDate.now().plusDays(1)),
                                DateSlot.from(LocalDate.now().plusDays(2)),
                                DateSlot.from(LocalDate.now().plusDays(3))),
                        List.of(TimeSlot.from(LocalTime.of(10, 0)),
                                TimeSlot.from(LocalTime.of(10, 30)),
                                TimeSlot.from(LocalTime.of(11, 0)),
                                TimeSlot.from(LocalTime.of(11, 30))),
                        DateTimeSlot.from(
                                LocalDateTime.of(
                                        LocalDate.now().plusDays(3), LocalTime.of(10, 0)))
                ));

        final Participant participant = participantRepository.save(Participant.withoutId(room.getId(), "강산"));
        System.out.println(participant);

        // when
        // then
        assertThatThrownBy(() -> roomApplicationService.saveParticipant(
                new ParticipantCreateInput(room.getSession(), "강산")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Participant name already exists: 강산");
    }

    private boolean isValidSession(final RoomSession session) {
        final String tsid = session.getTsid().toString();
        if (tsid.isEmpty()) {
            return false;
        }
        return Tsid.isValid(tsid);
    }
}
