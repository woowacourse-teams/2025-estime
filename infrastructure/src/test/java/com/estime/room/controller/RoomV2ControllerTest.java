package com.estime.room.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.estime.TestApplication;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.TsidRoomSessionGenerator;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV2;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import com.estime.room.slot.CompactDateTimeSlot;
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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = TestApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RoomV2ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private AvailableDateSlotRepository availableDateSlotRepository;

    @Autowired
    private AvailableTimeSlotRepository availableTimeSlotRepository;

    @Autowired
    private TsidRoomSessionGenerator roomSessionGenerator;

    private Room room;
    private RoomSession roomSession;

    @BeforeEach
    void setUp() {
        roomSession = roomSessionGenerator.generate();
        room = roomRepository.save(Room.withoutId(
                "Test Room V2",
                roomSession,
                LocalDateTime.now().plusDays(7)
        ));

        availableDateSlotRepository.save(AvailableDateSlot.of(room.getId(), LocalDate.now().plusDays(1)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(10, 0)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(14, 0)));
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

    @DisplayName("GET /api/v2/rooms/{session}/votes - Compact 참여자의 투표를 조회한다")
    @Test
    void getParticipantVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/votes", roomSession.getValue())
                        .param("participantName", "gangsan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slotCodes").isArray());
    }

    @DisplayName("GET /api/v2/rooms/{session}/votes - 존재하지 않는 참여자 조회 시 404 에러")
    @Test
    void getParticipantVotes_notFound() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v2/rooms/{session}/votes", roomSession.getValue())
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

        final LocalDateTime dateTime = LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0));
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
        final LocalDateTime invalidDateTime = LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(20, 0));
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
        final LocalDateTime dateTime = LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0));
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
}
