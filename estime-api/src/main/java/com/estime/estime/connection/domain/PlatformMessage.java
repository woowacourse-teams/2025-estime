package com.estime.estime.connection.domain;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum PlatformMessage {

    CONNECTED_ROOM_CREATE("아인슈타임이 나타났어요!", "일정 조율 시작하기"),
    CONNECTED_ROOM_CREATED("아인슈타임이 기다려요!", "일정 조율 참여하기"),
    CONNECTED_ROOM_REMIND("아인슈타임이 초조해요!", "일정 조율 참여하기"),
    CONNECTED_ROOM_SOLVED("아인슈타임이 해결했어요!", "일정 조율 확인하기");

    public static final String SERVICE_SLOGAN = "똑똑하게 시간 조율하기!";

    private final String title;
    private final String shortcutDescription;

    public String getTitle() {
        return "💡 " + title;
    }

    public String getShortcutDescription() {
        return "🔗 " + shortcutDescription;
    }
}
