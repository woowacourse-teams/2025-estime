package com.estime.room.exception;

import com.estime.shared.exception.DomainException;
import com.estime.shared.DomainTerm;
import com.estime.shared.exception.ExceptionMessageFormatter;

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
