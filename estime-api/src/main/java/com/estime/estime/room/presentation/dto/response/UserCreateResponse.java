package com.estime.estime.room.presentation.dto.response;

import com.estime.estime.user.application.dto.output.UserCreateOutput;

public record UserCreateResponse(
        String name
) {
    public static UserCreateResponse from(final UserCreateOutput output) {
        return new UserCreateResponse(output.name());
    }
}
