package com.bether.bether.connection.presentation;

import com.bether.bether.common.CustomApiResponse;
import com.bether.bether.connection.application.ConnectedRoomApplicationService;
import com.bether.bether.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.bether.bether.connection.presentation.dto.request.ConnectedRoomCreateRequest;
import com.bether.bether.connection.presentation.dto.response.ConnectedRoomCreateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ConnectedRoomController implements ConnectedRoomControllerSpecification {

    private final ConnectedRoomApplicationService applicationService;

    public CustomApiResponse<ConnectedRoomCreateResponse> create(
            @RequestBody final ConnectedRoomCreateRequest request
    ) {
        final ConnectedRoomCreateOutput output = applicationService.save(request.toInput());
        return CustomApiResponse.created(ConnectedRoomCreateResponse.from(output));
    }
}
