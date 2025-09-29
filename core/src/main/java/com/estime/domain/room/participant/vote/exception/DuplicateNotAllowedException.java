package com.estime.domain.room.participant.vote.exception;

import com.estime.domain.DomainTerm;
import com.estime.exception.DomainException;
import com.estime.util.ExceptionMessageFormatter;

public class DuplicateNotAllowedException extends DomainException {

    public DuplicateNotAllowedException(final DomainTerm term, final Object... params) {
        super(
                buildLogMessage(term, params),
                buildUserMessage(term)
        );
    }

    private static String buildLogMessage(final DomainTerm term, final Object... params) {
        return ExceptionMessageFormatter.format("Duplicate element is not allowed in %s".formatted(term.name()),
                params);
    }

    private static String buildUserMessage(final DomainTerm term) {
        return "%s에 중복값은 입력할 수 없습니다.".formatted(term.label()); // FIXME: 중복 투표값 입력은 내부 오류로 처리해야 합니다.
    }
}
