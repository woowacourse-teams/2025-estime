package com.estime.domain.room.exception;

import com.estime.domain.DomainTerm;
import com.estime.exception.DomainException;
import com.estime.util.ExceptionMessageFormatter;

public class DeadlineOverdueException extends DomainException {

    public DeadlineOverdueException(final Object... params) {
        super(
                buildLogMessage(params),
                buildUserMessage()
        );
    }

    private static String buildLogMessage(final Object... params) {
        return ExceptionMessageFormatter.format("%s exceeded".formatted(DomainTerm.DEADLINE), params);
    }

    private static String buildUserMessage() {
        return "마감기한이 경과되어 더이상 추가/수정하실 수 없습니다. 결과를 확인해 주세요.";
    }
}
