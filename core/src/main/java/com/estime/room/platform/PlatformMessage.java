package com.estime.room.platform;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformMessage {

    JOIN("아인슈타임을 호출했습니다!", "`/도움말` 로 사용법을 확인해 보세요!"),
    HELP("아인슈타임 사용법!", "`/시작하기` 로 디스코드와 연동된 일정 조율을 시작할 수 있어요!"),

    ROOM_CREATE("아인슈타임이 나타났어요!", "일정 조율 시작하기"),
    ROOM_CREATED("아인슈타임이 기다려요!", "일정 조율 참여하기"),
    ROOM_REMIND("아인슈타임이 초조해요!", "일정 조율 참여하기"),
    ROOM_SOLVED("아인슈타임이 해결했어요!", "일정 조율 확인하기");

    public static final String SERVICE_SLOGAN = "똑똑하게 시간 조율";

    private final String title;
    private final String description;

    public String getTitleWithEmoji() {
        return "💡 " + title;
    }

    public String getDescriptionWithEmoji() {
        return "🔗 " + description;
    }
}
