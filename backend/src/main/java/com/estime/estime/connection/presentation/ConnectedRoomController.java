package com.estime.estime.connection.presentation;

import com.estime.estime.common.CustomApiResponse;
import com.estime.estime.connection.application.ConnectedRoomApplicationService;
import com.estime.estime.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.estime.estime.connection.presentation.dto.request.ConnectedRoomCreateRequest;
import com.estime.estime.connection.presentation.dto.response.ConnectedRoomCreateResponse;
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
