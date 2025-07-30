package com.estime.estime.user.application.dto.output;

import com.estime.estime.user.domain.User;

public record UserCreateOutput(
        String name
) {

    public static UserCreateOutput from(final User user) {
        return new UserCreateOutput(user.getName());
    }
}
