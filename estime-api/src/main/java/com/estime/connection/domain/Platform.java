package com.estime.connection.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Platform {

    DISCORD("디스코드"),
    SLACK("슬랙");

    private final String description;
}
