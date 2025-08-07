package com.estime.common;

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
    ;

    private final String label;

    DomainTerm(final String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
