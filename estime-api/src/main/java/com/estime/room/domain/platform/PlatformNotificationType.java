package com.estime.room.domain.platform;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformNotificationType {
    CREATED("방 생성"),
    REMIND("투표 독려"),
    DEADLINE("투표 마감");

    private final String description;
}
