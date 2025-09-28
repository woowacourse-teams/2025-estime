package com.estime.room.platform;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformCommand {

    HELP("도움말", "아인슈타임 사용법 알아보기"),
    CREATE("시작하기", "아인슈타임에게 도움 요청하기"),
    ;

    private final String value;
    private final String description;
}
