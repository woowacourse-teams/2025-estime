package com.bether.bether.user.application.dto.input;

import com.bether.bether.user.domain.User;

public record UserCreateInput(
        String roomSession,
        String name,
        String password
) {
    public User toEntity(final Long roomId) {
        return User.withoutId(roomId, name, password);
    }
}
