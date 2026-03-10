package com.estime.room.controller;

import com.estime.room.RoomSession;
import com.estime.room.controller.dto.request.ConnectedRoomCreateRequestV3;
import com.estime.room.controller.dto.request.ParticipantCreateRequest;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV3;
import com.estime.room.controller.dto.request.RoomCreateRequestV3;
import com.estime.room.controller.dto.response.ConnectedRoomCreateResponse;
import com.estime.room.controller.dto.response.DateTimeSlotStatisticResponseV3;
import com.estime.room.controller.dto.response.ParticipantCheckResponse;
import com.estime.room.controller.dto.response.ParticipantVotesResponseV3;
import com.estime.room.controller.dto.response.RoomCreateResponse;
import com.estime.room.controller.dto.response.RoomResponseV3;
import com.estime.shared.CustomApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Room V3 API", description = "룸 API V3 (Instant 직접 반환, slot 네이밍)")
@RequestMapping("/api/v3/rooms")
public interface RoomV3ControllerSpecification {

    @Operation(summary = "룸 생성")
    @PostMapping
    CustomApiResponse<RoomCreateResponse> createRoom(
            @RequestBody RoomCreateRequestV3 request
    );

    @Operation(summary = "커넥티드 룸 생성")
    @PostMapping("/connected")
    CustomApiResponse<ConnectedRoomCreateResponse> createConnectedRoom(
            @RequestBody ConnectedRoomCreateRequestV3 request
    );

    @Operation(summary = "룸 상세 정보 조회")
    @GetMapping("/{session}")
    CustomApiResponse<RoomResponseV3> getBySession(
            @PathVariable("session") RoomSession session
    );

    @Operation(summary = "일시 기준, 참여자 투표 통계 조회")
    @GetMapping("/{session}/statistics/date-time-slots")
    CustomApiResponse<DateTimeSlotStatisticResponseV3> getDateTimeSlotStatisticBySession(
            @PathVariable("session") RoomSession session
    );

    @Operation(summary = "참여자 기준, 투표 일시 조회")
    @GetMapping("/{session}/votes/participants")
    CustomApiResponse<ParticipantVotesResponseV3> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") RoomSession session,
            @RequestParam("participantName") String participantName
    );

    @Operation(summary = "참여자 제출 시간 수정")
    @PutMapping("/{session}/votes/participants")
    CustomApiResponse<ParticipantVotesResponseV3> updateParticipantVotes(
            @PathVariable("session") RoomSession session,
            @RequestBody ParticipantVotesUpdateRequestV3 request
    );

    @Operation(summary = "새로운 참여자 이름 중복 검증 후 생성")
    @PostMapping("/{session}/participants")
    CustomApiResponse<ParticipantCheckResponse> createParticipant(
            @PathVariable("session") RoomSession session,
            @RequestBody ParticipantCreateRequest request
    );
}
