package com.estime.connection.domain;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformCommand {

    HELP("도움말", "아인슈타임 사용법 알아보기"),
    CREATE("시작하기", "아인슈타임에게 도움 요청하기"),
    ;

    private final String name;
    private final String description;

    public static boolean exists(final String command) {
        return Arrays.stream(values())
                .anyMatch(cmd -> cmd.getCommandWithSlash().equals(command));
    }

    public String getCommandWithSlash() {
        return "/" + name;
    }
}
