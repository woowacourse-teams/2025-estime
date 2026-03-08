package com.estime.room.controller.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;

/**
 * "2026-01-01T09:00+09:00" → offset 기반 Instant 변환
 * <p>
 * "2026-01-01T09:00"       → Asia/Seoul 기준 Instant 변환 (하위 호환)
 */
public class FlexibleInstantDeserializer extends JsonDeserializer<Instant> {

    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Seoul");

    private static final DateTimeFormatter ISO_OFFSET_DATE_TIME = new DateTimeFormatterBuilder()
            .append(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            .appendOffset("+HH:MM", "Z")
            .toFormatter();

    @Override
    public Instant deserialize(
            final JsonParser parser,
            final DeserializationContext context
    ) throws IOException {
        final String value = parser.getText().trim();

        try {
            return ISO_OFFSET_DATE_TIME.parse(value, Instant::from);
        } catch (final DateTimeParseException ignored) {
            return LocalDateTime.parse(value).atZone(DEFAULT_ZONE).toInstant();
        }
    }
}
