package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.user.application.dto.input.UserCreateInput;

public record UserCreateRequest(
        String name,
        String password
) {

    public UserCreateInput toInput(final String roomSession) {
        return new UserCreateInput(roomSession, name, password);
    }
}
