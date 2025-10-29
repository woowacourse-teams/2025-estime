package com.estime.room.controller;

import com.estime.room.RoomSession;
import com.estime.room.controller.dto.request.ParticipantVotesUpdateRequestV2;
import com.estime.room.controller.dto.response.ParticipantVotesResponseV2;
import com.estime.room.controller.dto.response.VoteStatisticResponseV2;
import com.estime.shared.CustomApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Room V2 API", description = "압축 슬롯 기반 투표 API")
@RequestMapping("/api/v2/rooms")
public interface RoomV2ControllerSpecification {

    @Operation(summary = "투표 업데이트")
    @PostMapping("/{session}/votes")
    CustomApiResponse<ParticipantVotesResponseV2> updateVotes(
            @PathVariable("session") RoomSession session,
            @RequestBody ParticipantVotesUpdateRequestV2 request
    );

    @Operation(summary = "참가자 투표 조회")
    @GetMapping("/{session}/votes")
    CustomApiResponse<ParticipantVotesResponseV2> getVotes(
            @PathVariable("session") RoomSession session,
            @RequestParam("participantName") String participantName
    );

    @Operation(summary = "투표 통계 조회")
    @GetMapping("/{session}/statistics")
    CustomApiResponse<VoteStatisticResponseV2> getStatistics(
            @PathVariable("session") RoomSession session
    );
}
