package com.estime.connection.domain;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformCommand {

    CREATE("estime-create", "아인슈타임에게 도움 요청하기"),
    ;

    private final String command;
    private final String description;

    public static boolean exists(final String command) {
        return Arrays.stream(values())
                .anyMatch(cmd -> cmd.getCommandWithSlash().equals(command));
    }

    public String getCommandWithSlash() {
        return "/" + command;
    }
}
