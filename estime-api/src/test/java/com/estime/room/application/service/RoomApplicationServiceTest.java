package com.estime.room.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.common.NotFoundException;
import com.estime.room.application.dto.input.ParticipantCreateInput;
import com.estime.room.application.dto.input.RoomCreateInput;
import com.estime.room.application.dto.input.VotesUpdateInput;
import com.estime.room.application.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.application.dto.output.ParticipantCheckOutput;
import com.estime.room.application.dto.output.RoomCreateOutput;
import com.estime.room.application.dto.output.RoomOutput;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.participant.Participant;
import com.estime.room.domain.participant.ParticipantRepository;
import com.estime.room.domain.participant.vote.Vote;
import com.estime.room.domain.participant.vote.VoteRepository;
import com.estime.room.domain.participant.vote.Votes;
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
import org.junit.jupiter.api.BeforeEach;
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

    @Autowired
    private VoteRepository voteRepository;

    private Room room;
    private Participant participant1;
    private Participant participant2;

    @BeforeEach
    void setUp() {
        room = roomRepository.save(
                Room.withoutId(
                        "test",
                        List.of(DateSlot.from(LocalDate.now().plusDays(1))),
                        List.of(TimeSlot.from(LocalTime.of(10, 0))),
                        DateTimeSlot.from(LocalDateTime.of(LocalDate.now().plusDays(3), LocalTime.of(10, 0)))
                ));

        participant1 = participantRepository.save(Participant.withoutId(room.getId(), "user1"));
        participant2 = participantRepository.save(Participant.withoutId(room.getId(), "user2"));
    }

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
        // when
        final RoomOutput output = roomApplicationService.getRoomBySession(room.getSession().getRoomSession());

        // then
        assertSoftly(softAssertions -> {
            softAssertions.assertThat(output.title())
                    .isEqualTo(room.getTitle());
            softAssertions.assertThat(output.availableDateSlots())
                    .containsExactlyInAnyOrderElementsOf(room.getAvailableDateSlots());
            softAssertions.assertThat(output.availableTimeSlots())
                    .containsExactlyInAnyOrderElementsOf(room.getAvailableTimeSlots());
            softAssertions.assertThat(output.deadline())
                    .isEqualTo(room.getDeadline());
            softAssertions.assertThat(output.session())
                    .isEqualTo(room.getSession());
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

    @DisplayName("투표 통계를 계산한다.")
    @Test
    void calculateVoteStatistic() {
        // given
        final DateTimeSlot slot1 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        voteRepository.save(Vote.of(participant1.getId(), slot1));
        voteRepository.save(Vote.of(participant2.getId(), slot1));

        // when
        final DateTimeSlotStatisticOutput result = roomApplicationService.calculateVoteStatistic(
                room.getSession().getRoomSession());

        // then
        assertSoftly(softly -> {
            softly.assertThat(result.participantCount()).isEqualTo(2);
            softly.assertThat(result.statistic()).hasSize(1);
            softly.assertThat(result.statistic().get(0).dateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(result.statistic().get(0).participantNames()).containsExactlyInAnyOrder("user1", "user2");
        });
    }

    @DisplayName("참여자 투표를 조회한다.")
    @Test
    void getParticipantVotesBySessionAndParticipantName() {
        // given
        final DateTimeSlot slot1 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        voteRepository.save(Vote.of(participant1.getId(), slot1));

        // when
        final Votes votes = roomApplicationService.getParticipantVotesBySessionAndParticipantName(
                room.getSession().getRoomSession(),
                participant1.getName());

        // then
        assertSoftly(softly -> {
            softly.assertThat(votes.getElements()).hasSize(1);
            softly.assertThat(votes.getElements().iterator().next().getId().getDateTimeSlot()).isEqualTo(slot1);
        });
    }

    @DisplayName("참여자 투표를 수정한다. (추가, 삭제, 유지)")
    @Test
    void updateParticipantVotes_complex() {
        // given
        final DateTimeSlot slotToRemove = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        final DateTimeSlot slotToKeep = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 30)));
        final DateTimeSlot slotToAdd = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(11, 0)));

        voteRepository.save(Vote.of(participant1.getId(), slotToRemove));
        voteRepository.save(Vote.of(participant1.getId(), slotToKeep));

        final VotesUpdateInput input = new VotesUpdateInput(room.getSession(), participant1.getName(),
                List.of(slotToKeep, slotToAdd));

        // when
        final Votes updatedVotes = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotes.getElements()).hasSize(2);
            softly.assertThat(updatedVotes.getElements()).extracting(vote -> vote.getId().getDateTimeSlot())
                    .containsExactlyInAnyOrder(slotToKeep, slotToAdd);

            final Votes persistedVotes = voteRepository.findAllByParticipantId(participant1.getId());
            softly.assertThat(persistedVotes.getElements()).hasSize(2);
            softly.assertThat(persistedVotes.getElements()).extracting(vote -> vote.getId().getDateTimeSlot())
                    .containsExactlyInAnyOrder(slotToKeep, slotToAdd);
        });
    }

    @DisplayName("참여자의 모든 투표를 다른 투표로 교체한다.")
    @Test
    void updateParticipantVotes_replaceAll() {
        // given
        final DateTimeSlot initialSlot1 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        final DateTimeSlot initialSlot2 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 30)));
        voteRepository.save(Vote.of(participant1.getId(), initialSlot1));
        voteRepository.save(Vote.of(participant1.getId(), initialSlot2));

        final DateTimeSlot newSlot1 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(11, 0)));
        final DateTimeSlot newSlot2 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(11, 30)));
        final VotesUpdateInput input = new VotesUpdateInput(room.getSession(), participant1.getName(),
                List.of(newSlot1, newSlot2));

        // when
        final Votes updatedVotes = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotes.getElements()).hasSize(2);
            softly.assertThat(updatedVotes.getElements()).extracting(vote -> vote.getId().getDateTimeSlot())
                    .containsExactlyInAnyOrder(newSlot1, newSlot2);
        });
    }

    @DisplayName("참여자의 모든 투표를 삭제한다.")
    @Test
    void updateParticipantVotes_removeAll() {
        // given
        final DateTimeSlot slot1 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        voteRepository.save(Vote.of(participant1.getId(), slot1));

        final VotesUpdateInput input = new VotesUpdateInput(room.getSession(), participant1.getName(), List.of());

        // when
        final Votes updatedVotes = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotes.isEmpty()).isTrue();
            softly.assertThat(voteRepository.findAllByParticipantId(participant1.getId()).isEmpty()).isTrue();
        });
    }

    @DisplayName("참여자 투표에 변경 사항이 없다.")
    @Test
    void updateParticipantVotes_noChange() {
        // given
        final DateTimeSlot slot1 = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        voteRepository.save(Vote.of(participant1.getId(), slot1));

        final VotesUpdateInput input = new VotesUpdateInput(room.getSession(), participant1.getName(), List.of(slot1));

        // when
        final Votes updatedVotes = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotes.getElements()).hasSize(1);
            softly.assertThat(updatedVotes.getElements().iterator().next().getId().getDateTimeSlot()).isEqualTo(slot1);
        });
    }

    @DisplayName("새로운 참여자를 저장한다.")
    @Test
    void saveParticipant() {
        // given
        final ParticipantCreateInput input = new ParticipantCreateInput(room.getSession(), "newUser");

        // when
        final ParticipantCheckOutput output = roomApplicationService.saveParticipant(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(output.isDuplicateName()).isFalse();
            softly.assertThat(participantRepository.existsByRoomIdAndName(room.getId(), "newUser")).isTrue();
        });
    }

    @DisplayName("중복된 이름의 참여자를 저장하면 isDuplicateName이 true를 반환한다.")
    @Test
    void saveParticipantWithDuplicateName() {
        // given
        final ParticipantCreateInput input = new ParticipantCreateInput(room.getSession(), participant1.getName());

        // when
        final ParticipantCheckOutput output = roomApplicationService.saveParticipant(input);

        // then
        assertThat(output.isDuplicateName()).isTrue();
    }

    private boolean isValidSession(final RoomSession session) {
        return Tsid.isValid(session.getRoomSession().toString());
    }
}
