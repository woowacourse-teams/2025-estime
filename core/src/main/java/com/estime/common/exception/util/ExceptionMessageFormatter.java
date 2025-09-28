package com.estime.common.exception.util;

import java.util.Arrays;
import java.util.stream.Collectors;

public final class ExceptionMessageFormatter {

    private ExceptionMessageFormatter() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static String format(final String baseMessage, final Object... params) {
        if (params == null || params.length == 0) {
            return baseMessage;
        }

        final String formattedParams = Arrays.stream(params)
                .map(param -> {
                    if (param == null) {
                        return "null=null";
                    }
                    final String key = param.getClass().getSimpleName();
                    return key + "=" + param;
                })
                .collect(Collectors.joining(", "));

        return String.format("%s params={%s}", baseMessage, formattedParams);
    }
}

