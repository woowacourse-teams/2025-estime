package com.bether.bether.connection.presentation;

import com.bether.bether.common.CustomApiResponse;
import com.bether.bether.connection.presentation.dto.response.ConnectedRoomCreateResponse;
import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.PostMapping;

public interface ConnectedRoomControllerSpecification {

    @Operation(summary = "커넥티드 룸 생성", description = "💡 새로운 커넥티드 룸을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                                            {
                                                "code": 201,
                                                "success": true,
                                                "message": null,
                                                "result": {
                                                    "session": "a4b1c2d3-e4f5-6789-0123-456789abcdef",
                                                    "platform": "DISCORD"
                                                }
                                            }
                                            """)))})
    @PostMapping
    CustomApiResponse<ConnectedRoomCreateResponse> create(
            @RequestBody(description = "생성할 커넥티드 룸의 정보를 입력합니다.", required = true, content = @Content(
                    examples = @ExampleObject(
                            summary = "커넥티드 룸 생성 예시",
                            value = """
                                    {
                                        "title": "Bether 스터디",
                                        "availableDates": [
                                            "2026-07-15",
                                            "2026-07-16"
                                        ],
                                        "startTime": "09:00",
                                        "endTime": "23:00",
                                        "deadLine": "2026-07-14T23:00",
                                        "isPublic": true,
                                        "platform": "DISCORD",
                                        "channelId": "C096H841ELㅌX"
                                    }
                                    """)))
            RoomCreateRequest request);
}
