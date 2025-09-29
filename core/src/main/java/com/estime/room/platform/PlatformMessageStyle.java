package com.estime.room.platform;

import java.time.format.DateTimeFormatter;
import java.util.Locale;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PlatformMessageStyle {

    DEFAULT(
            DateTimeFormatter.ofPattern("yyyy년 M월 d일 (E) a h:mm").withLocale(Locale.KOREAN),
            0x8c73e6
    );

    private final DateTimeFormatter dateTimeFormatter;
    private final int color;
}
