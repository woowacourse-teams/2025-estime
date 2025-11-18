package com.estime.room.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.dto.input.CompactVoteUpdateInput;
import com.estime.room.dto.input.CompactVotesOutput;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.output.CompactDateTimeSlotStatisticOutput;
import com.estime.room.exception.UnavailableSlotException;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVoteRepository;
import com.estime.room.participant.vote.compact.CompactVotes;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.shared.DomainTerm;
import com.estime.TestApplication;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
@Transactional
class CompactRoomApplicationServiceTest {

    private static final RoomSession roomSession = RoomSession.from("testRoomSession");

    @Autowired
    private CompactRoomApplicationService compactRoomApplicationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AvailableDateSlotRepository availableDateSlotRepository;

    @Autowired
    private AvailableTimeSlotRepository availableTimeSlotRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private CompactVoteRepository compactVoteRepository;

    private Room room;
    private Participant participant1;
    private Participant participant2;

    @BeforeEach
    void setUp() {
        final Room tempRoom = Room.withoutId(
                "test",
                roomSession,
                LocalDateTime.of(LocalDate.now().plusDays(3), LocalTime.of(10, 0))
        );
        room = roomRepository.save(tempRoom);

        availableDateSlotRepository.save(AvailableDateSlot.of(room.getId(), LocalDate.now().plusDays(1)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(10, 0)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(10, 30)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(11, 0)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(11, 30)));

        participant1 = participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("user1")));
        participant2 = participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("user2")));
    }

    @DisplayName("투표 통계를 계산한다.")
    @Test
    void calculateVoteStatistic() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), slot1));
        compactVoteRepository.save(CompactVote.of(participant2.getId(), slot1));

        // when
        final CompactDateTimeSlotStatisticOutput result = compactRoomApplicationService.calculateVoteStatistic(
                RoomSessionInput.from(room.getSession()));

        // then
        assertSoftly(softly -> {
            softly.assertThat(result.participantCount()).isEqualTo(2);
            softly.assertThat(result.statistic()).hasSize(1);
            softly.assertThat(result.statistic().getFirst().dateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(result.statistic().getFirst().participantNames())
                    .containsExactlyInAnyOrder(ParticipantName.from("user1"), ParticipantName.from("user2"));
        });
    }

    @DisplayName("참여자 투표를 조회한다.")
    @Test
    void getParticipantVotesBySessionAndParticipantName() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), slot1));

        // when
        final CompactVotesOutput votesOutput = compactRoomApplicationService.getParticipantVotesBySessionAndParticipantName(
                VotesFindInput.of(room.getSession(), participant1.getName().getValue()));

        // then
        assertSoftly(softly -> {
            softly.assertThat(votesOutput.votes()).hasSize(1);
            softly.assertThat(votesOutput.votes().getFirst().getCompactDateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(votesOutput.name()).isEqualTo(participant1.getName());
        });
    }

    @DisplayName("참여자 투표를 수정한다. (추가, 삭제, 유지)")
    @Test
    void updateParticipantVotes_complex() {
        // given
        final CompactDateTimeSlot slotToRemove = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        final CompactDateTimeSlot slotToKeep = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 30)));
        final CompactDateTimeSlot slotToAdd = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(11, 0)));

        compactVoteRepository.save(CompactVote.of(participant1.getId(), slotToRemove));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), slotToKeep));

        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of(slotToKeep, slotToAdd));

        // when
        final CompactVotesOutput updatedVotesOutput = compactRoomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).hasSize(2);
            softly.assertThat(updatedVotesOutput.votes()).extracting(vote -> vote.getId().getCompactDateTimeSlot())
                    .containsExactlyInAnyOrder(slotToKeep, slotToAdd);
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());

            final CompactVotes persistedVotes = compactVoteRepository.findAllByParticipantId(participant1.getId());
            softly.assertThat(persistedVotes.getElements()).hasSize(2);
            softly.assertThat(persistedVotes.getElements()).extracting(vote -> vote.getId().getCompactDateTimeSlot())
                    .containsExactlyInAnyOrder(slotToKeep, slotToAdd);
        });
    }

    @DisplayName("참여자의 모든 투표를 다른 투표로 교체한다.")
    @Test
    void updateParticipantVotes_replaceAll() {
        // given
        final CompactDateTimeSlot initialSlot1 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        final CompactDateTimeSlot initialSlot2 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 30)));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), initialSlot1));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), initialSlot2));

        final CompactDateTimeSlot newSlot1 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(11, 0)));
        final CompactDateTimeSlot newSlot2 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(11, 30)));
        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of(newSlot1, newSlot2));

        // when
        final CompactVotesOutput updatedVotesOutput = compactRoomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).hasSize(2);
            softly.assertThat(updatedVotesOutput.votes()).extracting(vote -> vote.getId().getCompactDateTimeSlot())
                    .containsExactlyInAnyOrder(newSlot1, newSlot2);
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());
        });
    }

    @DisplayName("참여자의 모든 투표를 삭제한다.")
    @Test
    void updateParticipantVotes_removeAll() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), slot1));

        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of());

        // when
        final CompactVotesOutput updatedVotesOutput = compactRoomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).isEmpty();
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());
            softly.assertThat(compactVoteRepository.findAllByParticipantId(participant1.getId()).isEmpty()).isTrue();
        });
    }

    @DisplayName("참여자 투표에 변경 사항이 없다.")
    @Test
    void updateParticipantVotes_noChange() {
        // given
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), slot1));

        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of(slot1));

        // when
        final CompactVotesOutput updatedVotesOutput = compactRoomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).hasSize(1);
            softly.assertThat(updatedVotesOutput.votes().getFirst().getCompactDateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());
        });
    }

    @DisplayName("사용 불가능한 CompactDateTimeSlot으로 투표를 업데이트하면 UnavailableSlotException이 발생한다. - 날짜가 범위 밖")
    @Test
    void updateParticipantVotes_withUnavailableDate() {
        // given
        final CompactDateTimeSlot unavailableSlot = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(2), LocalTime.of(10, 0)));
        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of(unavailableSlot));

        // when & then
        assertThatThrownBy(() -> compactRoomApplicationService.updateParticipantVotes(input))
                .isInstanceOf(UnavailableSlotException.class)
                .hasMessageContaining(DomainTerm.DATE_TIME_SLOT + " is outside the available range");
    }

    @DisplayName("사용 불가능한 CompactDateTimeSlot으로 투표를 업데이트하면 UnavailableSlotException이 발생한다. - 시간이 범위 밖")
    @Test
    void updateParticipantVotes_withUnavailableTime() {
        // given
        final CompactDateTimeSlot unavailableSlot = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(12, 0)));
        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of(unavailableSlot));

        // when & then
        assertThatThrownBy(() -> compactRoomApplicationService.updateParticipantVotes(input))
                .isInstanceOf(UnavailableSlotException.class)
                .hasMessageContaining(DomainTerm.DATE_TIME_SLOT + " is outside the available range");
    }

    @DisplayName("사용 불가능한 CompactDateTimeSlot으로 투표를 업데이트하면 UnavailableSlotException이 발생한다. - 날짜와 시간 둘 다 범위 밖")
    @Test
    void updateParticipantVotes_withUnavailableDateAndTime() {
        // given
        final CompactDateTimeSlot unavailableSlot = CompactDateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(2), LocalTime.of(12, 0)));
        final CompactVoteUpdateInput input = new CompactVoteUpdateInput(room.getSession(), participant1.getName(),
                List.of(unavailableSlot));

        // when & then
        assertThatThrownBy(() -> compactRoomApplicationService.updateParticipantVotes(input))
                .isInstanceOf(UnavailableSlotException.class)
                .hasMessageContaining(DomainTerm.DATE_TIME_SLOT + " is outside the available range");
    }
}
