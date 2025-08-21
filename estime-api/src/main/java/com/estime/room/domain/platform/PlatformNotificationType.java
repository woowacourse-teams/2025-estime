package com.estime.room.domain.platform;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformNotificationType {
    CREATED("방 생성"),
    REMIND("투표 독려"),
    SOLVED("투표 마감, 일정 조율 완료");

    private final String description;
}
