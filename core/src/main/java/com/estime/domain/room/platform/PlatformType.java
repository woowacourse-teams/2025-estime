package com.estime.domain.room.platform;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformType {

    DISCORD("디스코드");

    private final String description;

    public static PlatformType from(final String name) {
        for (final PlatformType each : PlatformType.values()) {
            if (each.name().equals(name)) {
                return each;
            }
        }
        throw new IllegalArgumentException("Invalid platform type: " + name);
    }
}
