package com.estime.connection.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.connection.presentation.dto.request.ConnectedRoomCreateRequest;
import com.estime.connection.presentation.dto.response.ConnectedRoomCreateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "ConnectedRoom", description = "커넥티드 룸 API")
@RequestMapping("/api/v1/connected-rooms")
public interface ConnectedRoomControllerSpecification {

    @Operation(summary = "커넥티드 룸 생성")
    @PostMapping
    CustomApiResponse<ConnectedRoomCreateResponse> create(
            @RequestBody ConnectedRoomCreateRequest request
    );
}
