package com.bether.bether.connection.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformCommand {

    CREATE("estime-create"),
    ;

    private final String command;

    public String getCommandWithSlash() {
        return "/" + command;
    }
}
