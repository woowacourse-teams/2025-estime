package com.estime.room.controller;

import com.estime.room.RoomSession;
import com.estime.room.controller.dto.request.ConnectedRoomCreateRequestV2;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV2;
import com.estime.room.controller.dto.request.RoomCreateRequestV2;
import com.estime.room.controller.dto.response.ConnectedRoomCreateResponse;
import com.estime.room.controller.dto.response.DateTimeSlotStatisticResponseV2;
import com.estime.room.controller.dto.response.ParticipantVotesResponseV2;
import com.estime.room.controller.dto.response.RoomCreateResponse;
import com.estime.room.controller.dto.response.RoomResponseV2;
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

@Tag(name = "Room V2 API", description = "룸 API V2 (compact)")
@RequestMapping("/api/v2/rooms")
public interface RoomV2ControllerSpecification {

    @Operation(summary = "룸 생성 (V2: dateTimeSlots)")
    @PostMapping
    CustomApiResponse<RoomCreateResponse> createRoom(
            @RequestBody RoomCreateRequestV2 request
    );

    @Operation(summary = "커넥티드 룸 생성 (V2: dateTimeSlots)")
    @PostMapping("/connected")
    CustomApiResponse<ConnectedRoomCreateResponse> createConnectedRoom(
            @RequestBody ConnectedRoomCreateRequestV2 request
    );

    @Operation(summary = "룸 상세 정보 조회 (V2: dateTimeSlots)")
    @GetMapping("/{session}")
    CustomApiResponse<RoomResponseV2> getBySession(
            @PathVariable("session") RoomSession session
    );

    @Operation(summary = "일시 기준, 참여자 투표 통계 조회 (compact)")
    @GetMapping("/{session}/statistics/date-time-slots")
    CustomApiResponse<DateTimeSlotStatisticResponseV2> getDateTimeSlotStatisticBySession(
            @PathVariable("session") RoomSession session
    );

    @Operation(summary = "참여자 기준, 투표 일시 조회 (compact)")
    @GetMapping("/{session}/votes/participants")
    CustomApiResponse<ParticipantVotesResponseV2> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") RoomSession session,
            @RequestParam("participantName") String participantName
    );

    @Operation(summary = "참여자 제출 시간 수정 (compact)")
    @PutMapping("/{session}/votes/participants")
    CustomApiResponse<ParticipantVotesResponseV2> updateParticipantVotes(
            @PathVariable("session") RoomSession session,
            @RequestBody ParticipantVotesUpdateRequestV2 request
    );
}
