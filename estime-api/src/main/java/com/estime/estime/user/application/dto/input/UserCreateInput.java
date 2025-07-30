package com.estime.estime.user.application.dto.input;

import com.estime.estime.user.domain.User;

public record UserCreateInput(
        String roomSession,
        String name,
        String password
) {
    public User toEntity(final Long roomId) {
        return User.withoutId(roomId, name, password);
    }
}
