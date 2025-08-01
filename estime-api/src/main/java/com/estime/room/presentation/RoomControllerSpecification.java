package com.estime.room.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.room.presentation.dto.request.ParticipantCreateRequest;
import com.estime.room.presentation.dto.request.ParticipantDateTimeSlotUpdateRequest;
import com.estime.room.presentation.dto.request.RoomCreateRequest;
import com.estime.room.presentation.dto.response.DateTimeSlotRecommendationsResponse;
import com.estime.room.presentation.dto.response.DateTimeSlotStatisticResponse;
import com.estime.room.presentation.dto.response.ParticipantCreateResponse;
import com.estime.room.presentation.dto.response.RoomCreateResponse;
import com.estime.room.presentation.dto.response.RoomResponse;
import com.estime.room.presentation.dto.response.TotalDateTimeSlotResponse;
import com.estime.room.presentation.dto.response.TotalDateTimeSlotUpdateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Room", description = "룸 관련 API")
@RequestMapping("/api/v1/rooms")
public interface RoomControllerSpecification {

    @Operation(summary = "룸 상세 정보 조회", description = "💡 세션 ID를 사용하여 특정 룸의 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    content = @Content(
                            examples = @ExampleObject(
                                    value = """
                                            {
                                                "code": 200,
                                                "success": true,
                                                "message": null,
                                                "result": {
                                                    "title": "Estime 스터디",
                                                    "availableDates": ["2026-07-15", "2026-07-16"],
                                                    "startTime": "09:00",
                                                    "endTime": "23:00",
                                                    "deadLine": "2026-07-14T23:00",
                                                    "isPublic": true,
                                                    "roomSession": "0MERYHCK3MCYH"
                                                }
                                            }
                                            """)))
    })
    @GetMapping("/{session}")
    CustomApiResponse<RoomResponse> getBySession(@PathVariable("session") String session);

    //

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
                                                    "session": "0MERYHCK3MCYH"
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
                                        "title": "Estime 스터디",
                                        "availableDates": [
                                            "2026-07-15",
                                            "2026-07-16"
                                        ],
                                        "startTime": "09:00",
                                        "endTime": "23:00",
                                        "deadLine": "2026-07-30T16:00",
                                        "isPublic": true
                                    }
                                    """)))
            RoomCreateRequest request);

    //

    @Operation(summary = "가능 시간대 통계 조회", description = "💡 특정 룸의 참여자들이 제출한 시간대 통계를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(content = @Content(
                    examples = @ExampleObject(value = """
                            {
                                "code": 200,
                                "success": true,
                                "message": null,
                                "result": {
                                    "dateTimeSlots": [
                                        {
                                            "dateTime": "2025-07-17T10:00",
                                            "userNames": ["플린트", "강산", "리버", "제프리"]
                                        },
                                        {
                                            "dateTime": "2025-07-17T11:00",
                                            "userNames": ["리버", "제프리"]
                                        }
                                    ]
                                }
                            }
                            """)))})
    @GetMapping("/{session}/time-slots/statistic")
    CustomApiResponse<DateTimeSlotStatisticResponse> generateDateTimeSlotStatistic(
            @PathVariable("session") String session);

    //

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
                                    "dateTimeSlots": [
                                        "2025-07-17T11:00",
                                        "2025-07-17T12:00",
                                        "2025-07-17T14:00"
                                    ]
                                }
                            }
                            """)))})
    @GetMapping("/{session}/time-slots/user")
    CustomApiResponse<TotalDateTimeSlotResponse> getByUserName(@PathVariable("session") String session,
                                                               @RequestParam("name") String userName);

    //

    @Operation(summary = "사용자 제출 시간 수정", description = "💡 특정 룸에 사용자가 제출한 시간 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    content = @Content(
                            examples = @ExampleObject(value = """
                                    {
                                        "code": 200,
                                        "success": true,
                                        "message": null,
                                        "result": {
                                                   "message": "저장이 완료되었습니다!",
                                                   "userName": "강감찬",
                                                   "dateTimes": [
                                                       "2025-07-21T16:00",
                                                       "2025-07-21T17:00",
                                                       "2025-07-22T20:00"
                                                   ]
                                               }
                                    }
                                    """)))})
    @PutMapping("/{session}/time-slots")
    CustomApiResponse<TotalDateTimeSlotUpdateResponse> updateDateTimeSlots(
            @PathVariable("session") final String session,
            @RequestBody(description = "수정할 사용자의 이름과 새로운 시간 목록을 입력합니다.", required = true, content = @Content(
                    examples = @ExampleObject(
                            summary = "시간 수정 예시",
                            value = """
                                    {
                                        "userName": "강감찬",
                                        "dateTimes": [
                                            "2025-07-21T16:00",
                                            "2025-07-21T17:00",
                                            "2025-07-22T20:00"
                                        ]
                                    }
                                    """
                    )
            )) ParticipantDateTimeSlotUpdateRequest request);

    //

    @Operation(summary = "룸 사용자 로그인", description = "💡 특정 룸에 새로운 사용자를 생성(로그인)합니다. 사용자는 이름과 비밀번호로 식별됩니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    content = @Content(
                            examples = @ExampleObject(value = """
                                    {
                                        "code": 200,
                                        "success": true,
                                        "message": null,
                                        "result": {
                                            "name": "홍길동"
                                        }
                                    }
                                    """)))
    })
    @PostMapping("/{session}/users")
    CustomApiResponse<ParticipantCreateResponse> createUser(@PathVariable("session") final String session,
                                                            @RequestBody(description = "생성할 사용자의 이름과 비밀번호를 입력합니다.", required = true,
                                                                    content = @Content(
                                                                            examples = @ExampleObject(
                                                                                    summary = "사용자 생성 요청 예시",
                                                                                    value = """
                                                                                            {
                                                                                                "name": "홍길동",
                                                                                                "password": "1234"
                                                                                            }
                                                                                            """
                                                                            )
                                                                    )) final ParticipantCreateRequest request);
}
