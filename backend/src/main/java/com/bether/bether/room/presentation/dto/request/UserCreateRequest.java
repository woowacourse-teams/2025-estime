package com.bether.bether.room.presentation.dto.request;

import com.bether.bether.user.application.dto.input.UserCreateInput;
import java.util.UUID;

public record UserCreateRequest(
        String name,
        String password
) {

    public UserCreateInput toInput(final UUID roomSession) {
        return new UserCreateInput(roomSession, name, password);
    }
}
