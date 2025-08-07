package com.estime.common.exception.util;

import com.estime.common.exception.domain.NullNotAllowedException;

public class Validator {

    public static void validateNotNull(final Object... objects) {
        for (Object object : objects) {
            if (object == null) {
                throw new NullNotAllowedException("TEMP"); // FIXME: Null 메세지 처리 추가, null일때 해당 객체를 파악할 수 없음
            }
        }
    }
}
