package com.estime.room.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.TsidRoomSessionGenerator;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV2;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.support.IntegrationTest;
import com.estime.room.participant.vote.compact.CompactVote;
import com.estime.room.participant.vote.compact.CompactVoteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.f4b6a3.tsid.TsidCreator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@Transactional
class RoomV2ControllerTest extends IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private CompactVoteRepository compactVoteRepository;

    @Autowired
    private TsidRoomSessionGenerator roomSessionGenerator;

    private Room room;
    private RoomSession roomSession;

    @BeforeEach
    void setUp() {
        roomSession = roomSessionGenerator.generate();
        final LocalDate date = NOW_LOCAL_DATE.plusDays(1);
        final Room tempRoom = Room.withoutId(
                "Test Room V2",
                roomSession,
                NOW_LOCAL_DATE_TIME.plusDays(7),
                List.of(
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 0))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(14, 0))),
                        CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(18, 0)))
                )
        );
        room = roomRepository.save(tempRoom);
    }

    @DisplayName("GET /api/v2/rooms/{session}/statistics/date-time-slots - Compact 투표 통계를 조회한다")
    @Test
    void getDateTimeSlotStatistic() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan2")));

        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/statistics/date-time-slots", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.participantCount").exists())
                .andExpect(jsonPath("$.data.participants").isArray())
                .andExpect(jsonPath("$.data.maxVoteCount").exists())
                .andExpect(jsonPath("$.data.statistics").isArray());
    }

    @DisplayName("GET /api/v2/rooms/{session}/statistics/date-time-slots - 잘못된 세션 형식 시 400(code)")
    @Test
    void getDateTimeSlotStatistic_invalidFormat() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/statistics/date-time-slots", "invalid-session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v2/rooms/{session}/statistics/date-time-slots - 존재하지 않는 방 조회 시 404 에러")
    @Test
    void getDateTimeSlotStatistic_notFound() throws Exception {
        // given: 유효한 TSID 형식이지만 존재하지 않는 세션
        final String nonExistentSession = TsidCreator.getTsid().toString();

        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/statistics/date-time-slots", nonExistentSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v2/rooms/{session}/votes/participants - Compact 참여자의 투표를 조회한다")
    @Test
    void getParticipantVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/votes/participants", roomSession.getValue())
                        .param("participantName", "gangsan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slotCodes").isArray());
    }

    @DisplayName("GET /api/v2/rooms/{session}/votes/participants - 존재하지 않는 참여자 조회 시 404 에러")
    @Test
    void getParticipantVotes_notFound() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/votes/participants", roomSession.getValue())
                        .param("participantName", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v2/rooms/{session}/votes/participants - Compact 참여자의 투표를 수정한다")
    @Test
    void updateParticipantVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final LocalDateTime dateTime = LocalDateTime.of(NOW_LOCAL_DATE.plusDays(1), LocalTime.of(10, 0));
        final int slotCode = CompactDateTimeSlot.from(dateTime).getEncoded();

        final ParticipantVotesUpdateRequestV2 request = new ParticipantVotesUpdateRequestV2(
                "gangsan",
                List.of(slotCode)
        );

        // when & then
        mockMvc.perform(put("/api/v2/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Update success"))
                .andExpect(jsonPath("$.data.slotCodes").isArray());
    }

    @DisplayName("PUT /api/v2/rooms/{session}/votes/participants - 유효하지 않은 Compact 시간대로 투표 수정 시 400 에러")
    @Test
    void updateParticipantVotes_invalidSlot() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        // 사용할 수 없는 시간대 (20:00)
        final LocalDateTime invalidDateTime = LocalDateTime.of(NOW_LOCAL_DATE.plusDays(1), LocalTime.of(20, 0));
        final int invalidSlotCode = CompactDateTimeSlot.from(invalidDateTime).getEncoded();

        final ParticipantVotesUpdateRequestV2 request = new ParticipantVotesUpdateRequestV2(
                "gangsan",
                List.of(invalidSlotCode)
        );

        // when & then
        mockMvc.perform(put("/api/v2/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v2/rooms/{session}/votes/participants - 존재하지 않는 참여자의 투표 수정 시 404 에러")
    @Test
    void updateParticipantVotes_participantNotFound() throws Exception {
        // given
        final LocalDateTime dateTime = LocalDateTime.of(NOW_LOCAL_DATE.plusDays(1), LocalTime.of(10, 0));
        final int slotCode = CompactDateTimeSlot.from(dateTime).getEncoded();

        final ParticipantVotesUpdateRequestV2 request = new ParticipantVotesUpdateRequestV2(
                "NonExistent",
                List.of(slotCode)
        );

        // when & then
        mockMvc.perform(put("/api/v2/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v2/rooms/{session}/votes/participants - 빈 투표 목록으로 수정 (모든 투표 제거)")
    @Test
    void updateParticipantVotes_emptyVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final ParticipantVotesUpdateRequestV2 request = new ParticipantVotesUpdateRequestV2(
                "gangsan",
                List.of()
        );

        // when & then
        mockMvc.perform(put("/api/v2/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slotCodes").isEmpty());
    }

    @DisplayName("GET /api/v2/rooms/{session}/statistics/date-time-slots - 통계가 slotCode 오름차순으로 정렬된다")
    @Test
    void getDateTimeSlotStatistic_sortedBySlotCode() throws Exception {
        // given: 참여자 2명 생성
        final Participant participant1 = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));
        final Participant participant2 = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("jeffrey")));

        final LocalDate date = NOW_LOCAL_DATE.plusDays(1);

        // 역순으로 투표 저장 (18:00, 14:00, 10:00)
        final CompactDateTimeSlot slot1 = CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(18, 0)));
        final CompactDateTimeSlot slot2 = CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(14, 0)));
        final CompactDateTimeSlot slot3 = CompactDateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 0)));

        compactVoteRepository.save(CompactVote.of(participant1.getId(), slot1));
        compactVoteRepository.save(CompactVote.of(participant1.getId(), slot2));
        compactVoteRepository.save(CompactVote.of(participant2.getId(), slot3));

        // when & then: slotCode가 오름차순으로 정렬되어야 함
        mockMvc.perform(get("/api/v2/rooms/{session}/statistics/date-time-slots", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.statistics[0].slotCode").value(slot3.getEncoded())) // 10:00
                .andExpect(jsonPath("$.data.statistics[1].slotCode").value(slot2.getEncoded())) // 14:00
                .andExpect(jsonPath("$.data.statistics[2].slotCode").value(slot1.getEncoded())); // 18:00
    }
}
