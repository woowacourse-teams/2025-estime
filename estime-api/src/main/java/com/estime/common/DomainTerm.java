package com.estime.common;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum DomainTerm {

    ROOM("방"),
    TIME_SLOT("시간"),
    DATE_SLOT("날짜"),
    DATE_TIME_SLOT("일시"),
    PARTICIPANT("참여자"),
    SESSION("세션"),
    VOTE("투표"),
    VOTES("투표들"),
    DEADLINE("마감일"),
    PLATFORM("플랫폼"),
    ;

    private final String label;

    public String label() {
        return label;
    }
}
