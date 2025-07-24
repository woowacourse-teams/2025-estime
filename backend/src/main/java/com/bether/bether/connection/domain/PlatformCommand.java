package com.bether.bether.connection.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformCommand {

    CREATE("estime-create", "아인슈타임에게 도움 요청하기"),
    ;

    private final String command;
    private final String description;

    public String getCommandWithSlash() {
        return "/" + command;
    }
}
