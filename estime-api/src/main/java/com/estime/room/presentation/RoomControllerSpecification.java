package com.estime.room.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.room.presentation.dto.request.ConnectedRoomCreateRequest;
import com.estime.room.presentation.dto.request.ParticipantCreateRequest;
import com.estime.room.presentation.dto.request.ParticipantVotesUpdateRequest;
import com.estime.room.presentation.dto.request.RoomCreateRequest;
import com.estime.room.presentation.dto.response.ConnectedRoomCreateResponse;
import com.estime.room.presentation.dto.response.DateTimeSlotStatisticResponse;
import com.estime.room.presentation.dto.response.ParticipantCheckResponse;
import com.estime.room.presentation.dto.response.ParticipantVotesResponse;
import com.estime.room.presentation.dto.response.ParticipantVotesUpdateResponse;
import com.estime.room.presentation.dto.response.RoomCreateResponse;
import com.estime.room.presentation.dto.response.RoomResponse;
import com.github.f4b6a3.tsid.Tsid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Room", description = "룸 API")
@RequestMapping("/api/v1/rooms")
public interface RoomControllerSpecification {

    @Operation(summary = "룸 생성")
    @PostMapping
    CustomApiResponse<RoomCreateResponse> createRoom(
            @RequestBody RoomCreateRequest request
    );

    @Operation(summary = "커넥티드 룸 생성")
    @PostMapping("/connceted")
    CustomApiResponse<ConnectedRoomCreateResponse> createConnectedRoom(
            @RequestBody ConnectedRoomCreateRequest request
    );

    @Operation(summary = "룸 상세 정보 조회")
    @GetMapping("/{session}")
    CustomApiResponse<RoomResponse> getBySession(
            @PathVariable("session") Tsid roomSession
    );

    @Operation(summary = "일시 기준, 참여자 투표 통계 조회")
    @GetMapping("/{session}/statistics/date-time-slots")
    CustomApiResponse<DateTimeSlotStatisticResponse> getDateTimeSlotStatisticBySession(
            @PathVariable("session") Tsid roomSession
    );

    @Operation(summary = "참여자 기준, 투표 일시 조회")
    @GetMapping("/{session}/votes/participants")
    CustomApiResponse<ParticipantVotesResponse> getParticipantVotesBySessionAndParticipantName(
            @PathVariable("session") Tsid roomSession,
            @RequestParam("participantName") String participantName
    );

    @Operation(summary = "참여자 제출 시간 수정")
    @PutMapping("/{session}/votes/participants")
    CustomApiResponse<ParticipantVotesUpdateResponse> updateParticipantVotes(
            @PathVariable("session") Tsid roomSession,
            @RequestBody ParticipantVotesUpdateRequest request
    );

    @Operation(summary = "새로운 참여자 이름 중복 검증 후 생성")
    @PostMapping("/{session}/participants")
    CustomApiResponse<ParticipantCheckResponse> createParticipant(
            @PathVariable("session") Tsid roomSession,
            @RequestBody ParticipantCreateRequest request
    );
}
