package com.estime.timepreference.domain;

import java.time.ZoneId;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.NONE)
public final class TimeZoneConstants {

    public static final ZoneId ASIA_SEOUL = ZoneId.of("Asia/Seoul");
    public static final String ASIA_SEOUL_STRING = "Asia/Seoul";
}
