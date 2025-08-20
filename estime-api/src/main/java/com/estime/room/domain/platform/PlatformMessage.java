package com.estime.room.domain.platform;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum PlatformMessage {

    HELP("아인슈타임을 호출했습니다! 👋", "`/도움말` 로 사용법을 확인해 보세요!"),
    ROOM_CREATE("아인슈타임이 나타났어요!", "일정 조율 시작하기"),
    ROOM_CREATED("아인슈타임이 기다려요!", "일정 조율 참여하기"),
    ROOM_REMIND("아인슈타임이 초조해요!", "일정 조율 참여하기"),
    ROOM_SOLVED("아인슈타임이 해결했어요!", "일정 조율 확인하기");

    public static final String SERVICE_SLOGAN = "똑똑하게 시간 조율";

    private final String title;
    private final String description;

    public String getTitle() {
        return "💡 " + title;
    }

    public String getDescription() {
        return "🔗 " + description;
    }
}
