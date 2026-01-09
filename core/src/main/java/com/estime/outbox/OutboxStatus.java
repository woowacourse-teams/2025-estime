package com.estime.outbox;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum OutboxStatus {
    PENDING("처리 대기 중"),
    PROCESSING("처리 중"),
    COMPLETED("처리 완료"),
    FAILED("처리 실패");

    private final String description;
}
