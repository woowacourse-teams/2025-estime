package com.estime.estime.room.presentation.dto.request;

import com.estime.estime.user.application.dto.input.UserCreateInput;

public record UserCreateRequest(
        String name,
        String password
) {

    public UserCreateInput toInput(final String roomSession) {
        return new UserCreateInput(roomSession, name, password);
    }
}
