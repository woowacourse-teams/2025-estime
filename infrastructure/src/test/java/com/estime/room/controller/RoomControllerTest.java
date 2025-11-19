package com.estime.room.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.estime.TestApplication;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.slot.AvailableDateSlot;
import com.estime.room.slot.AvailableDateSlotRepository;
import com.estime.room.slot.AvailableTimeSlot;
import com.estime.room.slot.AvailableTimeSlotRepository;
import com.estime.room.TsidRoomSessionGenerator;
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
class RoomControllerTest {

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
                "Test Room",
                roomSession,
                LocalDateTime.now().plusDays(7)
        ));

        availableDateSlotRepository.save(AvailableDateSlot.of(room.getId(), LocalDate.now().plusDays(1)));
        availableDateSlotRepository.save(AvailableDateSlot.of(room.getId(), LocalDate.now().plusDays(2)));

        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(10, 0)));
        availableTimeSlotRepository.save(AvailableTimeSlot.of(room.getId(), LocalTime.of(14, 0)));
    }

    @DisplayName("POST /api/v1/rooms - 방을 생성한다")
    @Test
    void createRoom() throws Exception {
        // given
        final LocalDateTime deadline = LocalDateTime.now().plusDays(7).withSecond(0).withNano(0);
        final String requestBody = """
                {
                    "title": "New Room",
                    "availableDateSlots": ["%s"],
                    "availableTimeSlots": ["10:00", "14:00"],
                    "deadline": "%s"
                }
                """.formatted(
                LocalDate.now().plusDays(1),
                deadline
        );

        // when & then
        mockMvc.perform(post("/api/v1/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.session").exists());
    }

    @DisplayName("GET /api/v1/rooms/{session} - 방 상세 정보를 조회한다")
    @Test
    void getBySession() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v1/rooms/{session}", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Test Room"))
                .andExpect(jsonPath("$.data.roomSession").value(roomSession.getValue()));
    }

    @DisplayName("GET /api/v1/rooms/{session} - 잘못된 세션 형식 시 400(code)")
    @Test
    void getBySession_invalidFormat() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v1/rooms/{session}", "invalid-session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v1/rooms/{session} - 존재하지 않는 방 조회 시 404 에러")
    @Test
    void getBySession_notFound() throws Exception {
        // given: 유효한 TSID 형식이지만 존재하지 않는 세션
        final String nonExistentSession = TsidCreator.getTsid().toString();

        // when & then
        mockMvc.perform(get("/api/v1/rooms/{session}", nonExistentSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("POST /api/v1/rooms/{session}/participants - 참여자를 생성한다")
    @Test
    void createParticipant() throws Exception {
        // given
        final String requestBody = """
                {
                    "participantName": "gangsan"
                }
                """;

        // when & then
        mockMvc.perform(post("/api/v1/rooms/{session}/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isDuplicateName").value(false));
    }

    @DisplayName("POST /api/v1/rooms/{session}/participants - 이미 존재하는 참여자 이름으로 생성 시 isDuplicateName=true")
    @Test
    void createParticipant_duplicate() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final String requestBody = """
                {
                    "participantName": "gangsan"
                }
                """;

        // when & then
        mockMvc.perform(post("/api/v1/rooms/{session}/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isDuplicateName").value(true));
    }

    @DisplayName("GET /api/v1/rooms/{session}/votes/participants - 참여자의 투표를 조회한다")
    @Test
    void getParticipantVotes() throws Exception {
        // given
        final Participant participant = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan"))
        );

        // when & then
        mockMvc.perform(get("/api/v1/rooms/{session}/votes/participants", roomSession.getValue())
                        .param("participantName", "gangsan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.participantName").value("gangsan"))
                .andExpect(jsonPath("$.data.dateTimeSlots").isArray());
    }

    @DisplayName("GET /api/v1/rooms/{session}/votes/participants - 존재하지 않는 참여자 조회 시 404 에러")
    @Test
    void getParticipantVotes_notFound() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v1/rooms/{session}/votes/participants", roomSession.getValue())
                        .param("participantName", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v1/rooms/{session}/votes/participants - 참여자의 투표를 수정한다")
    @Test
    void updateParticipantVotes() throws Exception {
        // given
        final Participant participant = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan"))
        );

        final String requestBody = """
                {
                    "participantName": "gangsan",
                    "dateTimeSlots": ["%s"]
                }
                """.formatted(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));

        // when & then
        mockMvc.perform(put("/api/v1/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Update success"))
                .andExpect(jsonPath("$.data.participantName").value("gangsan"))
                .andExpect(jsonPath("$.data.dateTimeSlots").isArray());
    }

    @DisplayName("PUT /api/v1/rooms/{session}/votes/participants - 유효하지 않은 시간대로 투표 수정 시 400 에러")
    @Test
    void updateParticipantVotes_invalidSlot() throws Exception {
        // given
        final Participant participant = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan"))
        );

        final String requestBody = """
                {
                    "participantName": "gangsan",
                    "dateTimeSlots": ["%s"]
                }
                """.formatted(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(20, 0)));

        // when & then
        mockMvc.perform(put("/api/v1/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("POST /api/v1/rooms/connected - 커넥티드 룸을 생성한다")
    @Test
    void createConnectedRoom() throws Exception {
        // given
        final String requestBody = """
                {
                    "title": "Connected Room",
                    "availableDateSlots": ["%s"],
                    "availableTimeSlots": ["10:00", "14:00"],
                    "deadline": "%s",
                    "platformType": "DISCORD",
                    "channelId": "test-channel",
                    "notification": {"created": true, "remind": false, "deadline": false}
                }
                """.formatted(
                LocalDate.now().plusDays(1),
                LocalDateTime.now().plusDays(7).withSecond(0).withNano(0)
        );

        // when & then
        mockMvc.perform(post("/api/v1/rooms/connected")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.session").exists())
                .andExpect(jsonPath("$.data.platformType").value("DISCORD"));
    }

    @DisplayName("PUT /api/v1/rooms/{session}/votes/participants - 존재하지 않는 참여자의 투표 수정 시 404 에러")
    @Test
    void updateParticipantVotes_participantNotFound() throws Exception {
        // given
        final String requestBody = """
                {
                    "participantName": "NonExistent",
                    "dateTimeSlots": ["%s"]
                }
                """.formatted(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0)));

        // when & then
        mockMvc.perform(put("/api/v1/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v1/rooms/{session}/statistics/date-time-slots - 투표 통계를 조회한다")
    @Test
    void getDateTimeSlotStatistic() throws Exception {
        // given
        final Participant participant1 = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan"))
        );
        final Participant participant2 = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan2"))
        );

        // when & then
        mockMvc.perform(get("/api/v1/rooms/{session}/statistics/date-time-slots", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.participantCount").exists())
                .andExpect(jsonPath("$.data.statistic").isArray());
    }

    @DisplayName("POST /api/v1/rooms - 과거 날짜로 방 생성 시 400 에러")
    @Test
    void createRoom_pastDate() throws Exception {
        // given
        final LocalDateTime deadline = LocalDateTime.now().plusDays(7).withSecond(0).withNano(0);
        final String requestBody = """
                {
                    "title": "Past Room",
                    "availableDateSlots": ["%s"],
                    "availableTimeSlots": ["10:00"],
                    "deadline": "%s"
                }
                """.formatted(
                LocalDate.now().minusDays(1),
                deadline
        );

        // when & then
        mockMvc.perform(post("/api/v1/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("POST /api/v1/rooms - 잘못된 형식의 요청 시 400 에러")
    @Test
    void createRoom_invalidRequest() throws Exception {
        // given
        final String requestBody = """
                {
                    "title": "",
                    "availableDateSlots": [],
                    "availableTimeSlots": []
                }
                """;

        // when & then
        mockMvc.perform(post("/api/v1/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }
}
