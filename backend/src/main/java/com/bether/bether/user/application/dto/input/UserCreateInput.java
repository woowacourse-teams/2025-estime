package com.bether.bether.user.application.dto.input;

import com.bether.bether.user.domain.User;
import java.util.UUID;

public record UserCreateInput(
        UUID roomSession,
        String name,
        String password
) {
    public User toEntity(final Long roomId) {
        return User.withoutId(roomId, name, password);
    }
}
