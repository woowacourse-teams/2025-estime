package com.bether.bether.room.presentation.dto.response;

import com.bether.bether.user.application.dto.output.UserCreateOutput;

public record UserCreateResponse(
        String name
) {
    public static UserCreateResponse from(final UserCreateOutput output) {
        return new UserCreateResponse(output.name());
    }
}
