package com.estime.timepreference.domain;

import java.time.ZoneId;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.NONE)
public final class TimeZoneConstants {

    public static final ZoneId ASIA_SEOUL = ZoneId.of("Asia/Seoul");
}
