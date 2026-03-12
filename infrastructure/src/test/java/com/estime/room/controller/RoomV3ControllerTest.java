package com.estime.room.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.TsidRoomSessionGenerator;
import com.estime.room.controller.dto.request.ConnectedRoomCreateRequestV3;
import com.estime.room.controller.dto.request.ConnectedRoomCreateRequestV3.PlatformNotificationRequest;
import com.estime.room.controller.dto.request.ParticipantCreateRequest;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV3;
import com.estime.room.controller.dto.request.RoomCreateRequestV3;
import com.estime.room.participant.Participant;
import com.estime.room.participant.ParticipantName;
import com.estime.room.participant.ParticipantRepository;
import com.estime.room.participant.vote.Vote;
import com.estime.room.participant.vote.VoteRepository;
import com.estime.room.slot.DateTimeSlot;
import com.estime.support.IntegrationTest;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@Transactional
class RoomV3ControllerTest extends IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private TsidRoomSessionGenerator roomSessionGenerator;

    private Room room;
    private RoomSession roomSession;
    private DateTimeSlot slot1;
    private DateTimeSlot slot2;
    private DateTimeSlot slot3;

    @BeforeEach
    void setUp() {
        roomSession = roomSessionGenerator.generate();
        final LocalDate date = NOW_LOCAL_DATE.plusDays(1);
        slot1 = DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(10, 0)).atZone(ZONE).toInstant());
        slot2 = DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(14, 0)).atZone(ZONE).toInstant());
        slot3 = DateTimeSlot.from(LocalDateTime.of(date, LocalTime.of(18, 0)).atZone(ZONE).toInstant());
        final Room tempRoom = Room.withoutId(
                "Test Room V3",
                roomSession,
                NOW_LOCAL_DATE_TIME.plusDays(7).atZone(ZONE).toInstant(),
                List.of(slot1, slot2, slot3),
                NOW
        );
        room = roomRepository.save(tempRoom);
    }

    @DisplayName("POST /api/v3/rooms - 방을 생성한다")
    @Test
    void createRoom() throws Exception {
        // given
        final RoomCreateRequestV3 request = new RoomCreateRequestV3(
                "New Room",
                List.of(slot1.getEncoded(), slot2.getEncoded()),
                NOW_LOCAL_DATE_TIME.plusDays(7).atZone(ZONE).toInstant()
        );

        // when & then
        mockMvc.perform(post("/api/v3/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.session").exists());
    }

    @DisplayName("POST /api/v3/rooms/connected - 커넥티드 룸을 생성한다")
    @Test
    void createConnectedRoom() throws Exception {
        // given
        final ConnectedRoomCreateRequestV3 request = new ConnectedRoomCreateRequestV3(
                "Connected Room",
                List.of(slot1.getEncoded(), slot2.getEncoded()),
                NOW_LOCAL_DATE_TIME.plusDays(7).atZone(ZONE).toInstant(),
                "DISCORD",
                "test-channel",
                new PlatformNotificationRequest(true, false, false)
        );

        // when & then
        mockMvc.perform(post("/api/v3/rooms/connected")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.session").exists())
                .andExpect(jsonPath("$.data.platformType").value("DISCORD"));
    }

    @DisplayName("GET /api/v3/rooms/{session} - 방 상세 정보를 조회한다 (slot encoded int 반환)")
    @Test
    void getBySession() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Test Room V3"))
                .andExpect(jsonPath("$.data.roomSession").value(roomSession.getValue()))
                .andExpect(jsonPath("$.data.availableSlots").isArray())
                .andExpect(jsonPath("$.data.availableSlots.length()").value(3))
                .andExpect(jsonPath("$.data.availableSlots[0]").isNumber())
                .andExpect(jsonPath("$.data.deadline").isString());
    }

    @DisplayName("GET /api/v3/rooms/{session} - 응답에 ETag 헤더가 포함된다")
    @Test
    void getBySession_returnsETag() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(header().exists("ETag"));
    }

    @DisplayName("GET /api/v3/rooms/{session} - 동일한 응답이면 304 Not Modified를 반환한다")
    @Test
    void getBySession_returnsNotModifiedWithMatchingETag() throws Exception {
        // given
        final MvcResult result = mockMvc.perform(get("/api/v3/rooms/{session}", roomSession.getValue()))
                .andExpect(status().isOk())
                .andReturn();

        final String etag = result.getResponse().getHeader("ETag");

        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}", roomSession.getValue())
                        .header("If-None-Match", etag))
                .andExpect(status().isNotModified());
    }

    @DisplayName("GET /api/v3/rooms/{session} - 잘못된 세션 형식 시 400(code)")
    @Test
    void getBySession_invalidFormat() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}", "invalid-session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v3/rooms/{session} - 존재하지 않는 방 조회 시 404 에러")
    @Test
    void getBySession_notFound() throws Exception {
        // given
        final String nonExistentSession = TsidCreator.getTsid().toString();

        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}", nonExistentSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v3/rooms/{session}/statistics/date-time-slots - 잘못된 세션 형식 시 400(code)")
    @Test
    void getDateTimeSlotStatistic_invalidFormat() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}/statistics/date-time-slots", "invalid-session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v3/rooms/{session}/statistics/date-time-slots - 존재하지 않는 방 통계 조회 시 404 에러")
    @Test
    void getDateTimeSlotStatistic_notFound() throws Exception {
        // given
        final String nonExistentSession = TsidCreator.getTsid().toString();

        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}/statistics/date-time-slots", nonExistentSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("GET /api/v3/rooms/{session}/statistics/date-time-slots - 투표 통계를 조회한다 (slot 필드)")
    @Test
    void getDateTimeSlotStatistic() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan2")));

        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}/statistics/date-time-slots", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.participantCount").exists())
                .andExpect(jsonPath("$.data.participants").isArray())
                .andExpect(jsonPath("$.data.maxVoteCount").exists())
                .andExpect(jsonPath("$.data.statistics").isArray());
    }

    @DisplayName("GET /api/v3/rooms/{session}/statistics/date-time-slots - 통계가 slot 오름차순으로 정렬된다")
    @Test
    void getDateTimeSlotStatistic_sortedBySlot() throws Exception {
        // given
        final Participant participant1 = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));
        final Participant participant2 = participantRepository.save(
                Participant.withoutId(room.getId(), ParticipantName.from("jeffrey")));

        // 역순으로 투표 저장 (18:00, 14:00, 10:00)
        voteRepository.save(Vote.of(participant1.getId(), slot3));
        voteRepository.save(Vote.of(participant1.getId(), slot2));
        voteRepository.save(Vote.of(participant2.getId(), slot1));

        // when & then: slot이 오름차순으로 정렬되어야 함
        mockMvc.perform(get("/api/v3/rooms/{session}/statistics/date-time-slots", roomSession.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.statistics[0].slot").value(slot1.getEncoded()))
                .andExpect(jsonPath("$.data.statistics[1].slot").value(slot2.getEncoded()))
                .andExpect(jsonPath("$.data.statistics[2].slot").value(slot3.getEncoded()));
    }

    @DisplayName("GET /api/v3/rooms/{session}/votes/participants - 참여자의 투표를 조회한다 (slots 필드)")
    @Test
    void getParticipantVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}/votes/participants", roomSession.getValue())
                        .param("participantName", "gangsan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slots").isArray());
    }

    @DisplayName("GET /api/v3/rooms/{session}/votes/participants - 존재하지 않는 참여자 조회 시 404 에러")
    @Test
    void getParticipantVotes_notFound() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v3/rooms/{session}/votes/participants", roomSession.getValue())
                        .param("participantName", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v3/rooms/{session}/votes/participants - 참여자의 투표를 수정한다 (slots 필드)")
    @Test
    void updateParticipantVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final ParticipantVotesUpdateRequestV3 request = new ParticipantVotesUpdateRequestV3(
                "gangsan",
                List.of(slot1.getEncoded())
        );

        // when & then
        mockMvc.perform(put("/api/v3/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Update success"))
                .andExpect(jsonPath("$.data.slots").isArray());
    }

    @DisplayName("PUT /api/v3/rooms/{session}/votes/participants - 유효하지 않은 시간대로 투표 수정 시 400 에러")
    @Test
    void updateParticipantVotes_invalidSlot() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final LocalDateTime invalidDateTime = LocalDateTime.of(NOW_LOCAL_DATE.plusDays(1), LocalTime.of(20, 0));
        final int invalidSlot = DateTimeSlot.from(invalidDateTime.atZone(ZONE).toInstant()).getEncoded();

        final ParticipantVotesUpdateRequestV3 request = new ParticipantVotesUpdateRequestV3(
                "gangsan",
                List.of(invalidSlot)
        );

        // when & then
        mockMvc.perform(put("/api/v3/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v3/rooms/{session}/votes/participants - 존재하지 않는 참여자의 투표 수정 시 404 에러")
    @Test
    void updateParticipantVotes_participantNotFound() throws Exception {
        // given
        final ParticipantVotesUpdateRequestV3 request = new ParticipantVotesUpdateRequestV3(
                "NonExistent",
                List.of(slot1.getEncoded())
        );

        // when & then
        mockMvc.perform(put("/api/v3/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("PUT /api/v3/rooms/{session}/votes/participants - 빈 투표 목록으로 수정 (모든 투표 제거)")
    @Test
    void updateParticipantVotes_emptyVotes() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final ParticipantVotesUpdateRequestV3 request = new ParticipantVotesUpdateRequestV3(
                "gangsan",
                List.of()
        );

        // when & then
        mockMvc.perform(put("/api/v3/rooms/{session}/votes/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slots").isEmpty());
    }

    @DisplayName("POST /api/v3/rooms - 과거 날짜로 방 생성 시 400 에러")
    @Test
    void createRoom_pastDate() throws Exception {
        // given
        final LocalDate pastDate = NOW_LOCAL_DATE.minusDays(1);
        final int pastSlot = DateTimeSlot.from(
                LocalDateTime.of(pastDate, LocalTime.of(10, 0)).atZone(ZONE).toInstant()
        ).getEncoded();
        final RoomCreateRequestV3 request = new RoomCreateRequestV3(
                "Past Room",
                List.of(pastSlot),
                NOW_LOCAL_DATE_TIME.plusDays(7).atZone(ZONE).toInstant()
        );

        // when & then
        mockMvc.perform(post("/api/v3/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("POST /api/v3/rooms - 잘못된 형식의 요청 시 400 에러")
    @Test
    void createRoom_invalidRequest() throws Exception {
        // given
        final RoomCreateRequestV3 request = new RoomCreateRequestV3(
                "",
                List.of(),
                null
        );

        // when & then
        mockMvc.perform(post("/api/v3/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));
    }

    @DisplayName("POST /api/v3/rooms/{session}/participants - 참여자를 생성한다")
    @Test
    void createParticipant() throws Exception {
        // given
        final ParticipantCreateRequest request = new ParticipantCreateRequest("gangsan");

        // when & then
        mockMvc.perform(post("/api/v3/rooms/{session}/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isDuplicateName").value(false));
    }

    @DisplayName("POST /api/v3/rooms/{session}/participants - 이미 존재하는 참여자 이름으로 생성 시 isDuplicateName=true")
    @Test
    void createParticipant_duplicate() throws Exception {
        // given
        participantRepository.save(Participant.withoutId(room.getId(), ParticipantName.from("gangsan")));

        final ParticipantCreateRequest request = new ParticipantCreateRequest("gangsan");

        // when & then
        mockMvc.perform(post("/api/v3/rooms/{session}/participants", roomSession.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isDuplicateName").value(true));
    }
}
