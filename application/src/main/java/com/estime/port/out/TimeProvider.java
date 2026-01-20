package com.estime.port.out;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public interface TimeProvider {

    Instant now();

    ZoneId zone();

    default LocalDateTime nowDateTime() {
        return now().atZone(zone()).toLocalDateTime();
    }
}
