package com.estime.common.logging;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MdcKey {

    TRACE_ID("traceId"),
    HOST("host"),
    HTTP_METHOD("httpMethod"),
    REQUEST_URI("requestUri"),
    QUERY_STRING("queryString"),
    CLIENT_IP("clientIp"),
    USER_AGENT("userAgent");

    private final String key;
}
