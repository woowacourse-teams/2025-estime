package com.estime.room.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.exception.NotFoundException;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.dto.input.ConnectedRoomCreateInput;
import com.estime.room.dto.input.DateSlotInput;
import com.estime.room.dto.input.ParticipantCreateInput;
import com.estime.room.dto.input.RoomCreateInput;
import com.estime.room.dto.input.RoomSessionInput;
import com.estime.room.dto.input.TimeSlotInput;
import com.estime.room.dto.input.VotesFindInput;
import com.estime.room.dto.input.VotesOutput;
import com.estime.room.dto.input.VotesUpdateInput;
import com.estime.room.dto.output.ConnectedRoomCreateOutput;
import com.estime.room.dto.output.DateTimeSlotStatisticOutput;
import com.estime.room.dto.output.ParticipantCheckOutput;
import com.estime.room.dto.output.RoomOutput;
import com.estime.room.exception.PastNotAllowedException;
import com.estime.room.exception.UnavailableSlotException;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.participant.vote.Votes;
import com.estime.room.platform.Platform;
import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.platform.notification.PlatformNotificationType;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.PlatformType;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.shared.DomainTerm;
import com.estime.TestApplication;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
@Transactional
class RoomApplicationServiceTest {

    private static final RoomSession roomSession = RoomSession.from("testRoomSession");

    @Autowired
    private RoomApplicationService roomApplicationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AvailableDateSlotRepository availableDateSlotRepository;

    @Autowired
    private AvailableTimeSlotRepository availableTimeSlotRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PlatformRepository platformRepository;

    private Room room;
    private Participant participant1;
    private Participant participant2;

    private static Stream<Arguments> unavailableDateTimeSlots() {
        return Stream.of(
                Arguments.of( // Case 1: 날짜(date)가 범위를 벗어나는 경우
                        DateTimeSlot.from(LocalDateTime.of(LocalDate.now().plusDays(2), LocalTime.of(10, 0)))
                ),
                Arguments.of( // Case 2: 시간(time)이 범위를 벗어나는 경우
                        DateTimeSlot.from(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(12, 0)))
                ),
                Arguments.of( // Case 3: 날짜(date)와 시간(time) 둘 다 범위를 벗어나는 경우
                        DateTimeSlot.from(LocalDateTime.of(LocalDate.now().plusDays(2), LocalTime.of(12, 0)))
                )
        );
    }

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

    @DisplayName("방을 생성할 수 있다.")
    @Test
    void createRoom() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(new DateSlotInput(LocalDate.now().plusDays(1))),
                List.of(new TimeSlotInput(LocalTime.of(7, 0)), new TimeSlotInput(LocalTime.of(20, 0))),
                LocalDateTime.now().plusYears(1)
        );

        // when
        // then
        assertThatCode(() -> roomApplicationService.createRoom(input))
                .doesNotThrowAnyException();
    }

    @DisplayName("세션을 기반으로 방을 조회할 수 있다.")
    @Test
    void getRoomBySession() {
        // when
        final RoomOutput output = roomApplicationService.getRoomBySession(
                RoomSessionInput.from(room.getSession()));

        // then
        assertSoftly(softAssertions -> {
            softAssertions.assertThat(output.title())
                    .isEqualTo(room.getTitle());
            softAssertions.assertThat(output.availableDateSlots()).hasSize(1);
            softAssertions.assertThat(output.availableTimeSlots()).hasSize(4);
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
        final String nonexistentSession = "no";

        // when // then
        assertThatThrownBy(() -> roomApplicationService.getRoomBySession(
                RoomSessionInput.from(RoomSession.from(nonexistentSession))))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining(DomainTerm.ROOM.name() + " is not exists");
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
                RoomSessionInput.from(room.getSession()));

        // then
        assertSoftly(softly -> {
            softly.assertThat(result.participantCount()).isEqualTo(2);
            softly.assertThat(result.statistic()).hasSize(1);
            softly.assertThat(result.statistic().getFirst().dateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(result.statistic().getFirst().participantNames())
                    .containsExactlyInAnyOrder(ParticipantName.from("user1"), ParticipantName.from("user2"));
            softly.assertThat(result.statistic().getFirst().dateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(result.statistic().getFirst().participantNames())
                    .containsExactlyInAnyOrder(ParticipantName.from("user1"), ParticipantName.from("user2"));
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
        final VotesOutput votesOutput = roomApplicationService.getParticipantVotesBySessionAndParticipantName(
                VotesFindInput.of(room.getSession(), participant1.getName().getValue()));

        // then
        assertSoftly(softly -> {
            softly.assertThat(votesOutput.votes()).hasSize(1);
            softly.assertThat(votesOutput.votes().getFirst().getId().getDateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(votesOutput.name()).isEqualTo(participant1.getName());
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
        final VotesOutput updatedVotesOutput = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).hasSize(2);
            softly.assertThat(updatedVotesOutput.votes()).extracting(vote -> vote.getId().getDateTimeSlot())
                    .containsExactlyInAnyOrder(slotToKeep, slotToAdd);
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());

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
        final VotesOutput updatedVotesOutput = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).hasSize(2);
            softly.assertThat(updatedVotesOutput.votes()).extracting(vote -> vote.getId().getDateTimeSlot())
                    .containsExactlyInAnyOrder(newSlot1, newSlot2);
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());
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
        final VotesOutput updatedVotesOutput = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).isEmpty();
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());
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
        final VotesOutput updatedVotesOutput = roomApplicationService.updateParticipantVotes(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(updatedVotesOutput.votes()).hasSize(1);
            softly.assertThat(updatedVotesOutput.votes().getFirst().getId().getDateTimeSlot()).isEqualTo(slot1);
            softly.assertThat(updatedVotesOutput.name()).isEqualTo(participant1.getName());
        });
    }

    @DisplayName("새로운 참여자를 생성한다.")
    @Test
    void createParticipant() {
        // given
        final ParticipantCreateInput input = new ParticipantCreateInput(room.getSession(),
                ParticipantName.from("newUser"));

        // when
        final ParticipantCheckOutput output = roomApplicationService.createParticipant(input);

        // then
        assertSoftly(softly -> {
            softly.assertThat(output.isDuplicateName()).isFalse();
            softly.assertThat(
                            participantRepository.existsByRoomIdAndName(room.getId(), ParticipantName.from("newUser")))
                    .isTrue();
        });
    }

    @DisplayName("중복된 이름의 참여자를 생성하면 isDuplicateName이 true를 반환한다.")
    @Test
    void createParticipantWithDuplicateName() {
        // given
        final ParticipantCreateInput input = new ParticipantCreateInput(room.getSession(), participant1.getName());

        // when
        final ParticipantCheckOutput output = roomApplicationService.createParticipant(input);

        // then
        assertThat(output.isDuplicateName()).isTrue();
    }

    @DisplayName("사용 불가능한 DateTimeSlot으로 투표를 업데이트하면 UnavailableSlotException이 발생한다.")
    @ParameterizedTest
    @MethodSource("unavailableDateTimeSlots")
    void updateParticipantVotes_withUnavailableDateTimeSlot(final DateTimeSlot unavailableSlot) {
        // given
        final VotesUpdateInput input = new VotesUpdateInput(room.getSession(), participant1.getName(),
                List.of(unavailableSlot));

        // when & then
        assertThatThrownBy(() -> roomApplicationService.updateParticipantVotes(input))
                .isInstanceOf(UnavailableSlotException.class)
                .hasMessageContaining(DomainTerm.DATE_TIME_SLOT.name() + " is outside the available range");
    }

    @DisplayName("플랫폼과 연결된 방 생성을 할 수 있다")
    @Test
    void createConnectedRoom() {
        // given
        final ConnectedRoomCreateInput input = new ConnectedRoomCreateInput(
                "title",
                List.of(new DateSlotInput(LocalDate.now().plusDays(1))),
                List.of(new TimeSlotInput(LocalTime.of(7, 0)), new TimeSlotInput(LocalTime.of(20, 0))),
                LocalDateTime.now().plusYears(1),
                PlatformType.DISCORD,
                "testChannelId",
                PlatformNotification.of(false, false, false)
        );

        // when
        final ConnectedRoomCreateOutput saved = roomApplicationService.createConnectedRoom(input);
        final Room room = roomRepository.findBySession(saved.session()).orElseThrow();

        // then
        assertSoftly(softly -> {
            softly.assertThat(platformRepository.findByRoomId(room.getId()))
                    .isPresent();
        });
    }

    @DisplayName("과거 날짜 슬롯으로 방을 생성하면 PastNotAllowedException이 발생한다")
    @Test
    void createRoom_withPastDateSlot() {
        // given
        final RoomCreateInput input = new RoomCreateInput(
                "title",
                List.of(new DateSlotInput(LocalDate.now().minusDays(1))),
                List.of(new TimeSlotInput(LocalTime.of(7, 0)), new TimeSlotInput(LocalTime.of(20, 0))),
                LocalDateTime.now().plusYears(1)
        );

        // when & then
        assertThatThrownBy(() -> roomApplicationService.createRoom(input))
                .isInstanceOf(PastNotAllowedException.class)
                .hasMessageContaining(DomainTerm.DATE_SLOT.name() + " cannot be past");
    }

    @DisplayName("플랫폼과 연결된 방 생성 시 과거 날짜 슬롯이면 PastNotAllowedException이 발생한다")
    @Test
    void createConnectedRoom_withPastDateSlot() {
        // given
        final ConnectedRoomCreateInput input = new ConnectedRoomCreateInput(
                "title",
                List.of(new DateSlotInput(LocalDate.now().minusDays(1))),
                List.of(new TimeSlotInput(LocalTime.of(7, 0)), new TimeSlotInput(LocalTime.of(20, 0))),
                LocalDateTime.now().plusYears(1),
                PlatformType.DISCORD,
                "testChannelId",
                PlatformNotification.of(false, false, false)
        );

        // when & then
        assertThatThrownBy(() -> roomApplicationService.createConnectedRoom(input))
                .isInstanceOf(PastNotAllowedException.class)
                .hasMessageContaining(DomainTerm.DATE_SLOT.name() + " cannot be past");
    }

    @DisplayName("존재하지 않는 참여자의 투표를 조회하면 NotFoundException이 발생한다")
    @Test
    void getParticipantVotes_withNonexistentParticipant() {
        // given
        final VotesFindInput input = VotesFindInput.of(room.getSession(), "nonexistent");

        // when & then
        assertThatThrownBy(() -> roomApplicationService.getParticipantVotesBySessionAndParticipantName(input))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining(DomainTerm.PARTICIPANT.name() + " is not exists");
    }

    @DisplayName("존재하지 않는 참여자의 투표를 업데이트하면 NotFoundException이 발생한다")
    @Test
    void updateParticipantVotes_withNonexistentParticipant() {
        // given
        final DateTimeSlot slot = DateTimeSlot.from(
                LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));
        final VotesUpdateInput input = new VotesUpdateInput(room.getSession(),
                ParticipantName.from("nonexistent"), List.of(slot));

        // when & then
        assertThatThrownBy(() -> roomApplicationService.updateParticipantVotes(input))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining(DomainTerm.PARTICIPANT.name() + " is not exists");
    }

    @DisplayName("플랫폼과 연결된 방 생성 시 CREATED 알림이 활성화되어 있으면 메시지를 전송한다")
    @Test
    void createConnectedRoom_withCreatedNotificationEnabled() {
        // given
        final ConnectedRoomCreateInput input = new ConnectedRoomCreateInput(
                "title",
                List.of(new DateSlotInput(LocalDate.now().plusDays(1))),
                List.of(new TimeSlotInput(LocalTime.of(7, 0)), new TimeSlotInput(LocalTime.of(20, 0))),
                LocalDateTime.now().plusYears(1),
                PlatformType.DISCORD,
                "testChannelId",
                PlatformNotification.of(true, false, false) // CREATED 알림 활성화
        );

        // when
        final ConnectedRoomCreateOutput saved = roomApplicationService.createConnectedRoom(input);
        final Room createdRoom = roomRepository.findBySession(saved.session()).orElseThrow();

        // then
        assertSoftly(softly -> {
            softly.assertThat(platformRepository.findByRoomId(createdRoom.getId()))
                    .isPresent();
            final Platform platform = platformRepository.findByRoomId(createdRoom.getId()).get();
            softly.assertThat(platform.getNotification().shouldNotifyFor(PlatformNotificationType.CREATION))
                    .isTrue();
        });
    }
}
