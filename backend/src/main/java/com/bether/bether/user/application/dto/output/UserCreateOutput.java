package com.bether.bether.user.application.dto.output;

import com.bether.bether.user.domain.User;

public record UserCreateOutput(
        String name
) {

    public static UserCreateOutput from(final User user) {
        return new UserCreateOutput(user.getName());
    }
}
