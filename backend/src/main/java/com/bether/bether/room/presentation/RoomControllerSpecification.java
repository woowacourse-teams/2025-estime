package com.bether.bether.room.presentation;

import com.bether.bether.common.CustomApiResponse;
import com.bether.bether.room.presentation.dto.request.RoomCreateRequest;
import com.bether.bether.room.presentation.dto.request.TimeSlotCreateRequest;
import com.bether.bether.room.presentation.dto.response.RoomCreateResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotRecommendationsResponse;
import com.bether.bether.room.presentation.dto.response.TimeSlotStatisticResponse;
import com.bether.bether.room.presentation.dto.response.TotalTimeSlotResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Room", description = "룸 관련 API")
@RequestMapping("/api/v1/rooms")
public interface RoomControllerSpecification {

    @Operation(summary = "룸 생성", description = "💡 새로운 룸을 생성합니다.")
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
                                                    "session": "a4b1c2d3-e4f5-6789-0123-456789abcdef"
                                                }
                                            }
                                            """)))})
    @PostMapping
    CustomApiResponse<RoomCreateResponse> create(
            @RequestBody(description = "생성할 룸의 정보를 입력합니다.", required = true, content = @Content(
                    examples = @ExampleObject(
                            summary = "룸 생성 예시",
                            value = """
                                    {
                                        "title": "Bether 스터디",
                                        "availableDates": [
                                            "2026-07-15",
                                            "2026-07-16"
                                        ],
                                        "startTime": "09:00:00",
                                        "endTime": "23:00:00"
                                    }
                                    """)))
            RoomCreateRequest request);

    @Operation(summary = "가능 시간대 통계 조회", description = "💡 특정 룸의 참여자들이 제출한 시간대 통계를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(content = @Content(
                    examples = @ExampleObject(value = """
                            {
                                "code": 200,
                                "success": true,
                                "message": null,
                                "result": {
                                    "timeSlots": [
                                        {
                                            "startTime": "2025-07-17T10:00:00",
                                            "availableMembers": 5
                                        },
                                        {
                                            "startTime": "2025-07-17T11:00:00",
                                            "availableMembers": 8
                                        }
                                    ]
                                }
                            }
                            """)))})
    @GetMapping("/{session}/time-slots/statistic")
    CustomApiResponse<TimeSlotStatisticResponse> getStatistic(@PathVariable("session") UUID session);

    @Operation(summary = "추천 시간대 순위 조회", description = "💡 가장 많은 인원이 가능한 시간대를 순위별로 추천받습니다.")
    @ApiResponses(value = {
            @ApiResponse(content = @Content(
                    examples = @ExampleObject(value = """
                            {
                                "code": 200,
                                "success": true,
                                "message": null,
                                "result": {
                                    "recommendations": [
                                        {
                                            "dateTime": "2025-07-17T11:00:00",
                                            "userNames": ["플린트", "강산", "리버", "제프리"]
                                        },
                                        {
                                            "dateTime": "2025-07-17T10:00:00",
                                            "userNames": ["강산", "제프리"]
                                        }
                                    ]
                                }
                            }
                            """)))})
    @GetMapping("/{session}/time-slots/recommendation")
    CustomApiResponse<TimeSlotRecommendationsResponse> getRecommendations(@PathVariable("session") UUID session);

    @Operation(summary = "사용자 가능 시간 제출", description = "💡 특정 룸에 사용자의 가능 시간을 제출(등록)합니다.")
    @ApiResponses(value = {
            @ApiResponse(content = @Content(
                    examples = @ExampleObject(value = """
                            {
                                "code": 201,
                                "success": true,
                                "message": null,
                                "result": null
                            }
                            """)))})
    @PostMapping("/{session}/time-slots")
    CustomApiResponse<Void> createTimeSlots(@PathVariable("session") UUID session,
                                            @RequestBody(description = "제출할 사용자의 이름과 가능한 시간 목록을 입력합니다.", required = true, content = @Content(
                                                    examples = @ExampleObject(
                                                            summary = "시간 제출 예시",
                                                            value = """
                                                                    {
                                                                        "userName": "강감찬",
                                                                        "dateTimes": [
                                                                            "2025-07-21T14:00:00",
                                                                            "2025-07-21T15:00:00",
                                                                            "2025-07-22T18:00:00",
                                                                            "2025-07-22T19:00:00"
                                                                        ]
                                                                    }
                                                                    """
                                                    )
                                            )) TimeSlotCreateRequest request);

    @Operation(summary = "특정 사용자 제출 시간 조회", description = "💡 룸에서 특정 사용자 이름으로 제출된 시간 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(content = @Content(
                    examples = @ExampleObject(value = """
                            {
                                "code": 200,
                                "success": true,
                                "message": null,
                                "result": {
                                    "userName": "홍길동",
                                    "timeSlots": [
                                        "2025-07-17T11:00:00",
                                        "2025-07-17T12:00:00",
                                        "2025-07-17T14:00:00"
                                    ]
                                }
                            }
                            """)))})
    @GetMapping("/{session}/time-slots/user")
    CustomApiResponse<TotalTimeSlotResponse> getByUserName(@PathVariable("session") UUID session,
                                                           @RequestParam("name") String userName);
}
