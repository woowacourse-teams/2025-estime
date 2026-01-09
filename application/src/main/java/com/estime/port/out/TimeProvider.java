package com.estime.port.out;

import java.time.Instant;
import java.time.ZoneId;

public interface TimeProvider {

    Instant now();

    ZoneId zone();
}
